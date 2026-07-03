// src/hooks/useLenis.js
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    // CRITICAL — sync Lenis scroll events with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // CRITICAL — drive Lenis via GSAP ticker
    // This replaces requestAnimationFrame and keeps everything in sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Prevents GSAP from trying to compensate for frame drops
    gsap.ticker.lagSmoothing(0)

    return () => {
      // Cleanup on unmount
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])
}