
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
}

const DicePreview = ({ diceGrid, settings, blackDiceCount, whiteDiceCount }: DicePreviewProps) => {
  const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

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

  if (!diceGrid.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50 h-96">
        <p className="text-gray-500">Upload an image and generate a dice mosaic to see the preview.</p>
      </div>
    );
  }

  const width = settings.gridSize * 1.6;
  const height = settings.gridSize * 1.6;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center p-4 border rounded-lg bg-white shadow-sm">
        <div className="overflow-auto max-h-[600px] w-full flex items-center justify-center p-4">
          <DiceCanvas
            diceGrid={diceGrid}
            settings={settings}
            onCanvasReady={setCurrentCanvas}
          />
        </div>
      </div>

      <MosaicSummary 
        width={width}
        height={height}
        blackDiceCount={blackDiceCount}
        whiteDiceCount={whiteDiceCount}
        isVisible={diceGrid.length > 0}
        onDownloadImage={downloadImage}
      />

      <DiceDownloadButtons
        onDownloadImage={downloadImage}
        onDownloadCSV={downloadCSV}
      />
    </div>
  );
};

export default DicePreview;
