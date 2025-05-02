
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
    
    // Changed to black background for consistent look
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const diceValue = diceGrid[row][col];
        const x = col * cellSize;
        const y = row * cellSize;
        
        // Use monochrome color scheme
        ctx.fillStyle = settings.faceColors[diceValue] || "#ffffff";
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Darker grid lines for better contrast against black/white
        ctx.strokeStyle = "#555555";
        ctx.lineWidth = 0.2;
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        if (settings.useShading) {
          drawDiceFace(ctx, diceValue, x, y, cellSize, settings.faceColors[diceValue]);
        } else {
          // White text for contrast against dark backgrounds
          const isDark = diceValue > 3;
          ctx.fillStyle = isDark ? "#ffffff" : "#000000";
          ctx.font = `${cellSize * 0.4}px Arial`; 
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
      className="max-w-full h-auto border border-gray-800 shadow-md"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

export default DiceCanvas;
