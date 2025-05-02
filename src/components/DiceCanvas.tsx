
import { useRef, useEffect } from "react";
import { drawDiceFace } from "@/utils/diceDrawing";
import { MosaicSettings } from "./MosaicControls";

interface DiceCanvasProps {
  diceGrid: number[][];
  settings: MosaicSettings;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

const DiceCanvas = ({ diceGrid, settings, onCanvasReady }: DiceCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !diceGrid.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rows = diceGrid.length;
    const cols = diceGrid[0].length;
    
    // Adjust cell size based on grid dimensions for better visibility
    const maxCanvasWidth = Math.min(window.innerWidth * 0.8, 800);
    const maxCanvasHeight = Math.min(window.innerHeight * 0.6, 600);
    
    const cellSizeByWidth = maxCanvasWidth / cols;
    const cellSizeByHeight = maxCanvasHeight / rows;
    const cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const diceValue = diceGrid[row][col];
        const x = col * cellSize;
        const y = row * cellSize;
        
        ctx.fillStyle = settings.faceColors[diceValue] || "#ffffff";
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Thinner grid lines for better visibility
        ctx.strokeStyle = "#dddddd";
        ctx.lineWidth = 0.2;
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        if (settings.useShading) {
          drawDiceFace(ctx, diceValue, x, y, cellSize, settings.faceColors[diceValue]);
        } else {
          ctx.fillStyle = "#000000";
          ctx.font = `${cellSize * 0.4}px Arial`; // Smaller font for better readability
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(diceValue.toString(), x + cellSize / 2, y + cellSize / 2);
        }
      }
    }

    onCanvasReady(canvas);
  }, [diceGrid, settings, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full h-auto border shadow-sm"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

export default DiceCanvas;
