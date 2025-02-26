"use client"

import { useDrag } from "react-dnd"
import { useRef, useEffect, useState } from "react"

interface DraggableImageProps {
  id: number
  src: string
  left: number
  top: number
  zIndex: number
  onClick: () => void
}

export default function DraggableImage({ id, src, left, top, zIndex, onClick }: DraggableImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 100, height: 100 })

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "image",
      item: { id, type: "image", x: left, y: top },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, left, top],
  )

  const [aspectRatio, setAspectRatio] = useState(1) // New: Store original aspect ratio

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setAspectRatio(img.width / img.height) // New: Calculate aspect ratio
      setSize({
        width: 100,
        height: 100 / (img.width / img.height), // New: Keep initial proportions
      })
    }
  }, [src])
  
  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  
    const startX = e.clientX
    const startWidth = size.width
  
    const onMouseMove = (moveEvent: MouseEvent) => {
      const diffX = moveEvent.clientX - startX
      const newWidth = Math.max(50, startWidth + diffX)
      const newHeight = newWidth / aspectRatio // New: Maintain aspect ratio
  
      setSize({
        width: newWidth,
        height: newHeight,
      })
    }
  
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", onMouseMove)
    })
  }
  

  return (
    <div
      ref={(node) => {
        drag(node)
        imageRef.current = node
      }}
      onMouseDown={onClick}
      style={{
        position: "absolute",
        left,
        top,
        zIndex,
        width: `${size.width}px`,
        height: `${size.height}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
      className="border relative"
    >
      <img
        src={src || "/placeholder.svg"}
        alt={`Draggable ${id}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        onMouseDown={handleResize}
        style={{
          width: "10px",
          height: "10px",
          background: "blue",
          position: "absolute",
          bottom: 0,
          right: 0,
          cursor: "nwse-resize",
        }}
      />
    </div>
  )
}
