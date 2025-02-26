"use client"

import { useState, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import Header from "./components/Header"
import LeftPanel from "./components/LeftPanel"
import Canvas from "./components/Canvas"
import BottomBar from "./components/BottomBar"


export default function Home() {
  const [images, setImages] = useState<string[]>([])
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (newImages: string[]) => {
    setImages([...images, ...newImages])
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel
            images={images}
            onImageUpload={handleImageUpload}
            isOpen={isLeftPanelOpen}
            onClose={() => setIsLeftPanelOpen(false)}
          />
          <Canvas images={images} ref={canvasRef} />
        </div>
        <BottomBar canvasRef={canvasRef}/>
      </div>
    </DndProvider>
  )
}
