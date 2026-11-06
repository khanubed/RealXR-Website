#!/usr/bin/env node

/**
 * ═════════════════════════════════════════════════════════════════════
 *  RealXR Media Optimization & Codec Transcoding Engine
 * ═════════════════════════════════════════════════════════════════════
 *  Converts & compresses images to next-gen WebP and videos to
 *  scroll-optimized WebM / H.264 MP4.
 *
 *  Usage:
 *    node scripts/optimize-media.js [options]
 *    npm run optimize:media
 *    npm run optimize:images
 *    npm run optimize:videos
 *
 *  Options:
 *    --type=<all|image|video>        Target media type (default: all)
 *    --input=<path>                  Single file or custom folder to scan
 *    --output=<path>                 Custom output destination folder
 *    --quality=<1-100>               WebP quality (default: 82)
 *    --max-width=<px>                Max width constraint (default: 1920)
 *    --crf=<18-45>                   WebM VP9 CRF quality (default: 30)
 *    --gop=<frames>                  Keyframe interval for scrub videos (default: 15)
 *    --recompress-webp               Re-encode existing WebP files > 500KB
 *    --dry-run                       Inspect candidate files without writing
 *    --help                          Show help and command list
 * ═════════════════════════════════════════════════════════════════════
 */

import fs from "node:fs";
import path from "node:path";
import { execSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// ── Parse CLI Arguments ──────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const match = args.find((a) => a.startsWith(`--${name}=`));
  if (match) return match.split("=")[1];
  if (args.includes(`--${name}`)) return true;
  return fallback;
};

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  🥽 RealXR Media Optimization CLI
  ─────────────────────────────────────────────────────────────
  Commands:
    node scripts/optimize-media.js                       # Scan & optimize all media
    node scripts/optimize-media.js --type=image          # Images only (PNG/JPG -> WebP)
    node scripts/optimize-media.js --type=video          # Videos only (MP4/MOV -> WebM + Scrub MP4)
    node scripts/optimize-media.js --recompress-webp     # Recompress oversized existing .webp (>500KB)
    node scripts/optimize-media.js --input=path/to/file  # Target specific file or directory
    node scripts/optimize-media.js --quality=75          # Custom WebP quality (1-100)
    node scripts/optimize-media.js --max-width=1200      # Max downscale width constraint
    node scripts/optimize-media.js --dry-run             # Preview sizes without converting
  `);
  process.exit(0);
}

const TYPE = (getArg("type", "all") || "all").toLowerCase();
const CUSTOM_INPUT = getArg("input", null);
const CUSTOM_OUTPUT = getArg("output", null);
const QUALITY = parseInt(getArg("quality", "82"), 10);
const MAX_WIDTH = parseInt(getArg("max-width", "1920"), 10);
const CRF = parseInt(getArg("crf", "30"), 10);
const GOP = parseInt(getArg("gop", "15"), 10);
const RECOMPRESS_WEBP = Boolean(getArg("recompress-webp", false));
const DRY_RUN = Boolean(getArg("dry-run", false));

// ── Verify FFmpeg Availability ───────────────────────────────────────
function checkFFmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    console.error(`
    ❌ FFmpeg was not found in your system PATH.
    FFmpeg is required to perform high-speed media transcoding.
    
    Installation:
      - Windows: choco install ffmpeg  or  winget install Gyan.FFmpeg
      - macOS:   brew install ffmpeg
      - Linux:   sudo apt install ffmpeg
    `);
    process.exit(1);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function runFFmpeg(cmdArgs) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", cmdArgs, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `FFmpeg failed with exit code ${code}`));
    });
  });
}

// ── Recursive Directory Scanner ──────────────────────────────────────
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".bmp", ".tiff"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".mkv", ".avi", ".m4v"]);

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // Ignore build output, dependencies, version control, and raw archives
    if (
      entry.isDirectory() &&
      !["node_modules", "dist", ".git", "raw"].includes(entry.name)
    ) {
      scanDirectory(fullPath, fileList);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      fileList.push({
        path: fullPath,
        ext,
        name: entry.name,
        size: fs.statSync(fullPath).size,
      });
    }
  }
  return fileList;
}

// ── Optimization Pipelines ───────────────────────────────────────────

/**
 * Convert or optimize an image to WebP
 */
async function processImage(file, stats) {
  const isWebP = file.ext === ".webp";
  const targetDir = CUSTOM_OUTPUT ? path.resolve(CUSTOM_OUTPUT) : path.dirname(file.path);
  const actualExt = path.extname(file.path);
  const baseName = path.basename(file.path, actualExt);
  const outPath = isWebP
    ? path.join(targetDir, `${baseName}-opt.webp`)
    : path.join(targetDir, `${baseName}.webp`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] Convert Image: ${path.relative(ROOT_DIR, file.path)} -> ${path.relative(ROOT_DIR, outPath)} (${formatBytes(file.size)})`);
    return;
  }

  // FFmpeg scale filter: preserves aspect ratio, never upscales smaller images
  const scaleFilter = `scale='min(iw,${MAX_WIDTH})':-2`;

  const ffmpegArgs = [
    "-i", file.path,
    "-vf", scaleFilter,
    "-c:v", "libwebp",
    "-quality", String(QUALITY),
    "-y",
    outPath,
  ];

  try {
    await runFFmpeg(ffmpegArgs);
    const newSize = fs.statSync(outPath).size;

    if (isWebP) {
      // If recompressing webp, replace original only if smaller
      if (newSize < file.size) {
        fs.unlinkSync(file.path);
        fs.renameSync(outPath, file.path);
        recordResult(file.path, file.size, newSize, stats);
      } else {
        fs.unlinkSync(outPath);
      }
    } else {
      recordResult(outPath, file.size, newSize, stats);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to process image ${file.name}: ${err.message}`);
  }
}

/**
 * Transcode video to WebM and Scroll-Scrubbed MP4
 */
async function processVideo(file, stats) {
  const targetDir = CUSTOM_OUTPUT ? path.resolve(CUSTOM_OUTPUT) : path.dirname(file.path);
  const actualExt = path.extname(file.path);
  const baseName = path.basename(file.path, actualExt);

  const outWebM = path.join(targetDir, `${baseName}.webm`);
  const outScrubMP4 = path.join(targetDir, `${baseName}-scrub.mp4`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] Transcode Video: ${path.relative(ROOT_DIR, file.path)} (${formatBytes(file.size)})`);
    return;
  }

  const scaleFilter = `scale='min(iw,${MAX_WIDTH})':-2`;

  // 1. Generate WebM (VP9 codec)
  try {
    console.log(`  🎬 Transcoding WebM (VP9): ${file.name} ...`);
    const webmArgs = [
      "-i", file.path,
      "-vf", scaleFilter,
      "-c:v", "libvpx-vp9",
      "-crf", String(CRF),
      "-b:v", "0",
      "-c:a", "libopus",
      "-b:a", "96k",
      "-y",
      outWebM,
    ];
    await runFFmpeg(webmArgs);
    const webmSize = fs.statSync(outWebM).size;
    recordResult(outWebM, file.size, webmSize, stats);
  } catch (err) {
    console.warn(`  ⚠️ WebM conversion failed for ${file.name}: ${err.message}`);
  }

  // 2. Generate Scroll-Scrub Optimized MP4 (H.264 with tight GOP for instant seek)
  try {
    console.log(`  🎬 Transcoding Scrub MP4 (GOP=${GOP}): ${file.name} ...`);
    const mp4Args = [
      "-i", file.path,
      "-vf", scaleFilter,
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", "22",
      "-g", String(GOP),
      "-keyint_min", String(GOP),
      "-sc_threshold", "0",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-c:a", "aac",
      "-b:a", "128k",
      "-y",
      outScrubMP4,
    ];
    await runFFmpeg(mp4Args);
    const mp4Size = fs.statSync(outScrubMP4).size;
    recordResult(outScrubMP4, file.size, mp4Size, stats);
  } catch (err) {
    console.warn(`  ⚠️ Scrub MP4 conversion failed for ${file.name}: ${err.message}`);
  }
}

function recordResult(filePath, oldSize, newSize, stats) {
  const saved = oldSize - newSize;
  const pct = oldSize > 0 ? ((saved / oldSize) * 100).toFixed(1) : "0.0";
  stats.totalBefore += oldSize;
  stats.totalAfter += newSize;
  stats.count += 1;

  const symbol = saved > 0 ? "⚡" : "•";
  console.log(
    `  ${symbol} ${path.basename(filePath).padEnd(28)} ` +
    `${formatBytes(oldSize).padStart(9)} -> ${formatBytes(newSize).padStart(9)} ` +
    `(${pct > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`})`
  );
}

// ── Main Execution ───────────────────────────────────────────────────
async function main() {
  checkFFmpeg();

  console.log(`
  ═════════════════════════════════════════════════════════════════
  🥽 REALXR MEDIA OPTIMIZER & TRANSCODER
  ═════════════════════════════════════════════════════════════════
  Mode:       ${TYPE.toUpperCase()}
  Quality:    WebP ${QUALITY}% | WebM CRF ${CRF}
  Max Width:  ${MAX_WIDTH}px
  GOP (Scrub): ${GOP} frames
  Dry Run:    ${DRY_RUN ? "YES (No writes)" : "NO (Live execution)"}
  ═════════════════════════════════════════════════════════════════
  `);

  let filesToScan = [];
  if (CUSTOM_INPUT) {
    const inputPath = path.resolve(CUSTOM_INPUT);
    if (fs.statSync(inputPath).isDirectory()) {
      filesToScan = scanDirectory(inputPath);
    } else {
      filesToScan = [{
        path: inputPath,
        ext: path.extname(inputPath).toLowerCase(),
        name: path.basename(inputPath),
        size: fs.statSync(inputPath).size,
      }];
    }
  } else {
    // Scan standard project media locations
    const searchDirs = [
      path.join(ROOT_DIR, "src", "assets"),
      path.join(ROOT_DIR, "public"),
    ];
    for (const d of searchDirs) {
      scanDirectory(d, filesToScan);
    }
  }

  // Filter candidates
  const imageCandidates = [];
  const videoCandidates = [];

  for (const f of filesToScan) {
    if (IMAGE_EXTS.has(f.ext)) {
      imageCandidates.push(f);
    } else if (f.ext === ".webp" && RECOMPRESS_WEBP && f.size > 500 * 1024) {
      imageCandidates.push(f);
    } else if (VIDEO_EXTS.has(f.ext)) {
      // Don't re-process files that are already scrub-optimized
      if (!f.name.includes("-scrub")) {
        videoCandidates.push(f);
      }
    }
  }

  const stats = { totalBefore: 0, totalAfter: 0, count: 0 };
  const startTime = Date.now();

  // Process Images
  if (TYPE === "all" || TYPE === "image") {
    if (imageCandidates.length > 0) {
      console.log(`📸 Processing ${imageCandidates.length} Image(s)...`);
      for (const img of imageCandidates) {
        await processImage(img, stats);
      }
      console.log("");
    } else {
      console.log("ℹ️ No unoptimized images found (PNG/JPG).\n");
    }
  }

  // Process Videos
  if (TYPE === "all" || TYPE === "video") {
    if (videoCandidates.length > 0) {
      console.log(`🎬 Processing ${videoCandidates.length} Video(s)...`);
      for (const vid of videoCandidates) {
        await processVideo(vid, stats);
      }
      console.log("");
    } else {
      console.log("ℹ️ No unoptimized videos found.\n");
    }
  }

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalSaved = stats.totalBefore - stats.totalAfter;
  const overallPct = stats.totalBefore > 0
    ? ((totalSaved / stats.totalBefore) * 100).toFixed(1)
    : "0.0";

  console.log(`
  ═════════════════════════════════════════════════════════════════
  ✨ OPTIMIZATION SUMMARY
  ═════════════════════════════════════════════════════════════════
  Files Transcoded:  ${stats.count}
  Total Original:    ${formatBytes(stats.totalBefore)}
  Total Optimized:   ${formatBytes(stats.totalAfter)}
  Bandwidth Saved:   ${formatBytes(Math.max(0, totalSaved))} (-${overallPct}%)
  Time Elapsed:      ${elapsed}s
  ═════════════════════════════════════════════════════════════════
  `);
}

main().catch((err) => {
  console.error("Fatal optimization error:", err);
  process.exit(1);
});
