
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MosaicSettings } from "./MosaicControls";
import DiceCanvas from "./DiceCanvas";
import MosaicSummary from "./MosaicSummary";
import DiceDownloadButtons from "./DiceDownloadButtons";

interface DicePreviewProps {
  diceGrid: number[][];
  settings: MosaicSettings;
  blackDiceCount: number;
  whiteDiceCount: number;
  isVisible: boolean;
}

const DicePreview = ({ diceGrid, settings, blackDiceCount, whiteDiceCount, isVisible }: DicePreviewProps) => {
  const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  if (!isVisible) {
    return null;
  }

  const downloadImage = () => {
    if (!currentCanvas) return;
    
    const dataUrl = currentCanvas.toDataURL("image/png");
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

  const downloadCSV = () => {
    const headers = ["Row", "Column", "Dice Value"];
    const csvRows = [headers];

    diceGrid.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        csvRows.push([String(rowIndex + 1), String(colIndex + 1), String(value)]);
      });
    });

    const csvContent = csvRows
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dice-mosaic.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your dice mosaic CSV has been downloaded.",
    });
  };

  // Calculate dice counts by face value
  const diceColorCounts: Record<string, number> = {};
  diceGrid.forEach(row => {
    row.forEach(value => {
      const color = settings.faceColors[value] || "#000000";
      diceColorCounts[color] = (diceColorCounts[color] || 0) + 1;
    });
  });

  if (!diceGrid.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50 h-96">
        <p className="text-gray-500">Upload an image and generate a dice mosaic to see the preview.</p>
      </div>
    );
  }

  const width = settings.gridSize * diceGrid[0].length / 10;
  const height = settings.gridSize * diceGrid.length / 10;

  return (
    <div className="mosaic-preview-container">
      <div className="preview-section">
        <div className="px-4 py-6">
          <h3 className="text-center font-semibold">Mosaic Summary</h3>
          
          <div className="canvas-container flex justify-center my-4">
            <DiceCanvas
              diceGrid={diceGrid}
              settings={settings}
              onCanvasReady={setCurrentCanvas}
            />
          </div>
          
          <div className="mosaic-info-grid mt-6">
            <div className="grid grid-cols-2 gap-2 text-sm max-w-md mx-auto">
              <div className="text-left">Dice Size</div>
              <div className="text-right font-medium">{settings.gridSize} mm</div>
              
              <div className="text-left">Width</div>
              <div className="text-right font-medium">{(width * 6).toFixed(2)} cm</div>
              
              <div className="text-left">Height</div>
              <div className="text-right font-medium">{(height * 6).toFixed(2)} cm</div>
              
              <div className="text-left">Estimated Time</div>
              <div className="text-right font-medium">
                {Math.floor((blackDiceCount + whiteDiceCount) / 10 / 60)} hours, {Math.floor((blackDiceCount + whiteDiceCount) / 10 % 60)} minutes
              </div>
              
              <div className="text-left">Monetary value</div>
              <div className="text-right font-medium">****** <a href="/blog" className="text-blue-600 underline">See Blog</a></div>
              
              <div className="text-left flex items-center">
                <div className="w-3 h-3 bg-black rounded-sm mr-1"></div>
                <span>Black Dice</span>
              </div>
              <div className="text-right font-medium">{blackDiceCount}</div>
              
              <div className="text-left flex items-center">
                <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm mr-1"></div>
                <span>White Dice</span>
              </div>
              <div className="text-right font-medium">{whiteDiceCount}</div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <DiceDownloadButtons
              onDownloadImage={downloadImage}
              onDownloadCSV={downloadCSV}
            />
          </div>
          
          <MosaicSummary
            width={(width * 6)}
            height={(height * 6)}
            blackDiceCount={blackDiceCount}
            whiteDiceCount={whiteDiceCount}
            isVisible={true}
            onDownloadImage={downloadImage}
            diceColors={diceColorCounts}
          />
        </div>
      </div>
    </div>
  );
};

export default DicePreview;
