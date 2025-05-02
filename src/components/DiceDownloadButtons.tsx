
import { Button } from "@/components/ui/button";
import { FileImage, FileText } from "lucide-react";

interface DiceDownloadButtonsProps {
  onDownloadImage: () => void;
  onDownloadCSV: () => void;
}

const DiceDownloadButtons = ({ onDownloadImage, onDownloadCSV }: DiceDownloadButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button 
        className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
        onClick={onDownloadImage}
      >
        <FileImage className="w-4 h-4" />
        Download Image
      </Button>
      <Button 
        variant="outline"
        className="border-black text-black hover:bg-gray-100 flex items-center gap-2"
        onClick={onDownloadCSV}
      >
        <FileText className="w-4 h-4" />
        Download CSV
      </Button>
    </div>
  );
};

export default DiceDownloadButtons;
