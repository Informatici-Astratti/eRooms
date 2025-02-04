"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
  images: string[]
  fullScreen?: boolean
  height?: number
  autoplay?: boolean
  autoplayInterval?: number
  animation?: "slide" | "fade"
  imageFit?: "cover" | "contain" | "fill"
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  fullScreen = false,
  height = 400,
  autoplay = false,
  autoplayInterval = 3000,
  animation = "slide",
  imageFit = "cover"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, autoplayInterval)
      return () => clearInterval(interval)
    }
  }, [autoplay, autoplayInterval, images.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <div className={`relative overflow-hidden w-full bg-muted`} style={{ height: fullScreen ? '100vh' : `${height}px` }}>
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentIndex}
          custom={currentIndex}
          variants={animation === "slide" ? slideVariants : fadeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex] || "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"}
            alt={`Slide ${currentIndex + 1}`}
            fill
            style={{ objectFit: `${imageFit}` }}
            priority
          />
        </motion.div>
      </AnimatePresence>

      {!autoplay && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  )
}

export default ImageCarousel

