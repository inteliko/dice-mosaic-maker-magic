
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { MosaicSettings } from "./MosaicControls";
import { useToast } from "@/hooks/use-toast";

interface DicePreviewProps {
  diceGrid: number[][];
  settings: MosaicSettings;
}

const DicePreview = ({ diceGrid, settings }: DicePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Draw dice grid on canvas
  useEffect(() => {
    if (!canvasRef.current || !diceGrid.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rows = diceGrid.length;
    const cols = diceGrid[0].length;
    
    // Set canvas size with a small margin for each cell
    const cellSize = Math.min(400 / cols, 400 / rows);
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    
    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw dice
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const diceValue = diceGrid[row][col];
        const x = col * cellSize;
        const y = row * cellSize;
        
        // Fill with dice face color
        ctx.fillStyle = settings.faceColors[diceValue] || "#ffffff";
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Draw border around dice
        ctx.strokeStyle = "#dddddd";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        if (settings.useShading) {
          // Draw dice face with dots
          drawDiceFace(ctx, diceValue, x, y, cellSize);
        } else {
          // Draw dice value
          ctx.fillStyle = "#000000";
          ctx.font = `${cellSize * 0.6}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(diceValue.toString(), x + cellSize / 2, y + cellSize / 2);
        }
      }
    }
  }, [diceGrid, settings]);

  // Function to draw dice face with dots
  const drawDiceFace = (
    ctx: CanvasRenderingContext2D,
    value: number,
    x: number,
    y: number,
    size: number
  ) => {
    const dotSize = size * 0.15;
    const padding = size * 0.2;
    
    // Use contrasting color for dots based on face color
    const faceColor = settings.faceColors[value];
    const r = parseInt(faceColor.slice(1, 3), 16);
    const g = parseInt(faceColor.slice(3, 5), 16);
    const b = parseInt(faceColor.slice(5, 7), 16);
    const isDark = (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    ctx.fillStyle = isDark ? "#ffffff" : "#000000";
    
    // Position dots based on dice value
    switch (value) {
      case 1:
        drawDot(ctx, x + size / 2, y + size / 2, dotSize);
        break;
      case 2:
        drawDot(ctx, x + padding, y + padding, dotSize);
        drawDot(ctx, x + size - padding, y + size - padding, dotSize);
        break;
      case 3:
        drawDot(ctx, x + padding, y + padding, dotSize);
        drawDot(ctx, x + size / 2, y + size / 2, dotSize);
        drawDot(ctx, x + size - padding, y + size - padding, dotSize);
        break;
      case 4:
        drawDot(ctx, x + padding, y + padding, dotSize);
        drawDot(ctx, x + padding, y + size - padding, dotSize);
        drawDot(ctx, x + size - padding, y + padding, dotSize);
        drawDot(ctx, x + size - padding, y + size - padding, dotSize);
        break;
      case 5:
        drawDot(ctx, x + padding, y + padding, dotSize);
        drawDot(ctx, x + padding, y + size - padding, dotSize);
        drawDot(ctx, x + size / 2, y + size / 2, dotSize);
        drawDot(ctx, x + size - padding, y + padding, dotSize);
        drawDot(ctx, x + size - padding, y + size - padding, dotSize);
        break;
      case 6:
        drawDot(ctx, x + padding, y + padding, dotSize);
        drawDot(ctx, x + padding, y + size / 2, dotSize);
        drawDot(ctx, x + padding, y + size - padding, dotSize);
        drawDot(ctx, x + size - padding, y + padding, dotSize);
        drawDot(ctx, x + size - padding, y + size / 2, dotSize);
        drawDot(ctx, x + size - padding, y + size - padding, dotSize);
        break;
    }
  };

  // Helper to draw a dot
  const drawDot = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  // Function to download the mosaic as image
  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "dice-mosaic.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your dice mosaic image has been downloaded.",
    });
  };

  // Function to download the grid as CSV
  const downloadCSV = () => {
    if (!diceGrid.length) return;
    
    const csvContent = diceGrid
      .map(row => row.join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dice-mosaic-grid.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your dice mosaic CSV has been downloaded.",
    });
  };

  if (!diceGrid.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50 h-96">
        <p className="text-gray-500">No preview available. Upload an image and generate a mosaic.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-white shadow-sm">
      <div className="overflow-auto w-full max-h-96 flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          className="max-w-full border shadow-sm"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <Button 
          variant="outline"
          className="flex items-center gap-1"
          onClick={downloadImage}
        >
          <Download size={16} />
          Download Image
        </Button>
        <Button 
          variant="outline"
          className="flex items-center gap-1"
          onClick={downloadCSV}
        >
          <Download size={16} />
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export default DicePreview;
