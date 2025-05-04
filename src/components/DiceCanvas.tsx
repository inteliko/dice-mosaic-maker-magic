
import { useRef, useEffect } from "react";
import { drawDiceFace } from "@/utils/diceDrawing";
import { MosaicSettings } from "./MosaicControls";
import { useIsMobile } from "@/hooks/use-mobile";

interface DiceCanvasProps {
  diceGrid: number[][];
  settings: MosaicSettings;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

const DiceCanvas = ({ diceGrid, settings, onCanvasReady }: DiceCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvasRef.current || !diceGrid.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rows = diceGrid.length;
    const cols = diceGrid[0].length;
    
    // Adjust cell size based on grid dimensions and device type
    const maxCanvasWidth = isMobile ? window.innerWidth * 0.85 : Math.min(window.innerWidth * 0.7, 800);
    const maxCanvasHeight = isMobile ? window.innerHeight * 0.5 : Math.min(window.innerHeight * 0.6, 600);
    
    // Calculate cell size based on available space and grid size
    const cellSizeByWidth = maxCanvasWidth / cols;
    const cellSizeByHeight = maxCanvasHeight / rows;
    const cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    const canvasWidth = cols * cellSize;
    const canvasHeight = rows * cellSize;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Fill canvas with theme-appropriate background
    if (settings.theme === "black") {
      ctx.fillStyle = "#111111";
    } else if (settings.theme === "white") {
      ctx.fillStyle = "#F8F8F8";
    } else {
      ctx.fillStyle = "#FFFFFF"; // Default background for mixed theme
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Improved dice rendering with better visibility
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const diceValue = diceGrid[row][col];
        const x = col * cellSize;
        const y = row * cellSize;
        
        // Set color based on the dice face value
        const diceColor = settings.faceColors[diceValue] || "#ffffff";
        ctx.fillStyle = diceColor;
        
        // Draw dice with better visibility
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Draw dots with better visibility threshold
        if (cellSize > 3 && settings.useShading) {
          drawDiceFace(ctx, diceValue, x, y, cellSize, diceColor);
        }
      }
    }

    onCanvasReady(canvas);
  }, [diceGrid, settings, onCanvasReady, isMobile]);

  return (
    <div className="dice-canvas-wrapper w-full overflow-x-auto">
      <canvas
        ref={canvasRef}
        className="max-w-full mx-auto border border-gray-200 shadow-sm"
        style={{ 
          imageRendering: "pixelated",
          backgroundColor: settings.theme === "white" ? "#F8F8F8" : 
                         settings.theme === "black" ? "#111111" : "#FFFFFF"
        }}
      />
    </div>
  );
};

export default DiceCanvas;
