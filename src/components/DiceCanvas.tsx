
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
    
    const maxSize = 20;
    const cellSize = Math.min(maxSize, Math.min(600 / cols, 600 / rows));
    
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
        
        ctx.strokeStyle = "#dddddd";
        ctx.lineWidth = 0.3;
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        if (settings.useShading) {
          drawDiceFace(ctx, diceValue, x, y, cellSize, settings.faceColors[diceValue]);
        } else {
          ctx.fillStyle = "#000000";
          ctx.font = `${cellSize * 0.5}px Arial`;
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
