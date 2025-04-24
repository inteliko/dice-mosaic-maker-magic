
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MosaicSettings } from "./MosaicControls";
import DiceCanvas from "./DiceCanvas";
import DiceDownloadButtons from "./DiceDownloadButtons";

interface DicePreviewProps {
  diceGrid: number[][];
  settings: MosaicSettings;
}

const DicePreview = ({ diceGrid, settings }: DicePreviewProps) => {
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
        <p className="text-gray-500">Upload an image and generate a dice mosaic to see the preview.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-white shadow-sm">
      <div className="overflow-auto w-full max-h-[calc(100vh-300px)] flex items-center justify-center p-4">
        <DiceCanvas
          diceGrid={diceGrid}
          settings={settings}
          onCanvasReady={setCurrentCanvas}
        />
      </div>
      
      <DiceDownloadButtons
        onDownloadImage={downloadImage}
        onDownloadCSV={downloadCSV}
      />
    </div>
  );
};

export default DicePreview;
