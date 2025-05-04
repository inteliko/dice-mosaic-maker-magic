
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
    // For large grids (>50x50), use a smaller scale factor
    const maxCanvasWidth = isMobile ? window.innerWidth * 0.85 : Math.min(window.innerWidth * 0.7, 800);
    const maxCanvasHeight = isMobile ? window.innerHeight * 0.5 : Math.min(window.innerHeight * 0.6, 600);
    
    // Calculate cell size based on available space and grid size
    const cellSizeByWidth = maxCanvasWidth / cols;
    const cellSizeByHeight = maxCanvasHeight / rows;
    const cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // For large grids, we might want to limit the canvas size further
    const canvasWidth = cols * cellSize;
    const canvasHeight = rows * cellSize;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Use pure black background for consistent look
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw each dice based on its value
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const diceValue = diceGrid[row][col];
        const x = col * cellSize;
        const y = row * cellSize;
        
        // Set color based on the dice face value
        ctx.fillStyle = settings.faceColors[diceValue] || "#ffffff";
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Only draw grid lines if cellSize is large enough
        // Improved contrast for the grid lines
        if (cellSize > 0.5) {
          ctx.strokeStyle = settings.theme === "white" ? "#999999" : "#555555";
          ctx.lineWidth = cellSize > 2 ? 0.3 : 0.15;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
        
        // Improved visibility for dice dots
        if (settings.useShading && cellSize > 3) {
          drawDiceFace(ctx, diceValue, x, y, cellSize, settings.faceColors[diceValue]);
        } else if (cellSize > 2) {
          // For smaller cells just show a number with better contrast
          // Determine if the background is dark to choose text color with better contrast
          const r = parseInt(settings.faceColors[diceValue].slice(1, 3), 16);
          const g = parseInt(settings.faceColors[diceValue].slice(3, 5), 16);
          const b = parseInt(settings.faceColors[diceValue].slice(5, 7), 16);
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
          
          // Using a sharper contrast threshold for better visibility
          const isDark = brightness < 150;
          
          ctx.fillStyle = isDark ? "#FFFFFF" : "#000000";
          ctx.font = `bold ${cellSize * 0.5}px Arial`; 
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(diceValue.toString(), x + cellSize / 2, y + cellSize / 2);
        }
        // For very small cells, just show the colored square with no dots or numbers
      }
    }

    onCanvasReady(canvas);
  }, [diceGrid, settings, onCanvasReady, isMobile]);

  return (
    <div className="dice-canvas-wrapper w-full overflow-x-auto">
      <canvas
        ref={canvasRef}
        className="max-w-full mx-auto border border-gray-200 shadow-sm"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
};

export default DiceCanvas;
