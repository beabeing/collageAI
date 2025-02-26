"use client"

import { useState, useCallback, forwardRef } from "react"
import { useDrop } from "react-dnd"
import DraggableImage from "./DraggableImage"

interface CanvasProps {
  images: string[]
}

interface ImagePosition {
  id: number
  x: number
  y: number
  zIndex: number // Added zIndex for layer management
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({ images }, ref) => {
  const [imagePositions, setImagePositions] = useState<ImagePosition[]>([])
  

  const moveImage = useCallback((id: number, left: number, top: number) => {
    setImagePositions((prev) => {
      const existing = prev.find((p) => p.id === id)
      const maxZIndex = prev.length > 0 ? Math.max(...prev.map((p) => p.zIndex)) : 0
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, x: left, y: top } : p))
      } else {
        return [...prev, { id, x: left, y: top, zIndex: maxZIndex + 1 }]
      }
    })
  }, [])

  const bringToFront = (id: number) => {
    setImagePositions((prev) => {
      const maxZIndex = prev.length > 0 ? Math.max(...prev.map((p) => p.zIndex)) : 0
      return prev.map((p) => (p.id === id ? { ...p, zIndex: maxZIndex + 1 } : p))
    })
  }

  const [, drop] = useDrop(
    () => ({
      accept: ["image", "newImage"],
      drop(item: { id: number; type: string; x: number; y: number }, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset()
        const left = Math.round(item.x + (delta?.x || 0))
        const top = Math.round(item.y + (delta?.y || 0))
        moveImage(item.id, left, top)
      },
    }),
    [moveImage],
  )

  return (
    <div
      ref={(node) => {
        drop(node)
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      className="flex-1 bg-white p-4 relative overflow-hidden"
      style={{ height: "600px" }}
    >
      <div className="border-2 border-dashed border-gray-300 h-full relative">
        {images.length === 0 ? (
          <p className="text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            拖放图片到这里开始创作
          </p>
        ) : (
          images.map((image, index) => {
            const position = imagePositions.find((p) => p.id === index) || { x: 0, y: 0, zIndex: 0 }
            return (
              <DraggableImage
                key={index}
                id={index}
                src={image || "/placeholder.svg"}
                left={position.x}
                top={position.y}
                zIndex={position.zIndex}
                onClick={() => bringToFront(index)}
              />
            )
          })
        )}
      </div>
    </div>
  )
})

Canvas.displayName = "Canvas"

export default Canvas