// src/hooks/useLenis.js
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useLenis() {
  useGSAP(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    // Sync Lenis scroll positions with ScrollTrigger updates
    lenis.on('scroll', ScrollTrigger.update)

    // Store the exact function reference so it can be cleanly detached later
    const updateTicker = (time) => {
      lenis.raf(time * 1000)
    }

    // Drive Lenis via GSAP's optimized engine loop
    gsap.ticker.add(updateTicker)

    // Prevents GSAP from trying to compensate for frame drops
    gsap.ticker.lagSmoothing(0)

    // Return the clean, isolated teardown logic
    return () => {
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
    }
  }, []) // Empty array ensures this runs once when the master engine config layer boots up
}