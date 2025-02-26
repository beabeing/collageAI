import type React from "react"
import html2canvas from "html2canvas"

interface BottomBarProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

const BottomBar: React.FC<BottomBarProps> = ({ canvasRef }) => {
  const downloadCanvasImage = () => {
    if (canvasRef.current) {
      html2canvas(canvasRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = "canvas-image.png";
        link.click();
      });
    }
  };

  return (
    <div className="bg-gray-200 p-4 flex justify-between">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">对齐</button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={downloadCanvasImage}
      >
        下载
      </button>
    </div>
  );
}

export default BottomBar;