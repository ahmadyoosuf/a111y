"use client"

import { useEffect, useRef, useState } from "react"

type ScrollRevealOptions = {
  threshold?: number
  rootMargin?: string
  delay?: number
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = "0px",
  delay = 0,
  once = true,
}: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Add initial hidden state class
    if (!isVisible) {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = `opacity 0.6s ease-out, transform 0.6s ease-out ${delay}ms`
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          // Delay the animation slightly for a staggered effect
          setTimeout(() => {
            setIsVisible(true)
            element.style.opacity = "1"
            element.style.transform = "translateY(0)"
          }, delay)

          // Unobserve after animation if once is true
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          // If not once, hide again when out of view
          setIsVisible(false)
          element.style.opacity = "0"
          element.style.transform = "translateY(20px)"
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, rootMargin, delay, once])

  return { ref, isVisible }
}
