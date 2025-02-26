import type { ChangeEvent } from "react"
import { useDrag } from "react-dnd"

interface LeftPanelProps {
  images: string[]
  onImageUpload: (newImages: string[]) => void
  isOpen: boolean
  onClose: () => void
}

export default function LeftPanel({ images, onImageUpload, isOpen, onClose }: LeftPanelProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      onImageUpload(newImages)
    }
  }

  return (
    <div
      className={`${isOpen ? "translate-x-0" : "-translate-x-full"} transform transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-30 w-64 bg-gray-100 p-4 flex flex-col md:relative md:translate-x-0`}
    >
      <button onClick={onClose} className="md:hidden absolute top-0 right-0 m-4">
        关闭
      </button>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mb-4" />
      <div className="flex-1 overflow-y-auto">
        {images.map((image, index) => (
          <NewDraggableImage key={index} id={index} src={image} />
        ))}
      </div>
    </div>
  )
}

function NewDraggableImage({ id, src }: { id: number; src: string }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "newImage",
      item: { id, type: "newImage", x: 0, y: 0 },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id],
  )

  return (
    <img
      ref={drag}
      src={src || "/placeholder.svg"}
      alt={`Uploaded ${id}`}
      className="mb-2 w-full cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    />
  )
}

