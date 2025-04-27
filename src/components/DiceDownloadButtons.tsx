
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
        variant="outline"
        className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700"
        onClick={onDownloadImage}
      >
        <FileImage className="w-4 h-4" />
        Download Image
      </Button>
      <Button 
        variant="outline"
        className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700"
        onClick={onDownloadCSV}
      >
        <FileText className="w-4 h-4" />
        Download CSV
      </Button>
    </div>
  );
};

export default DiceDownloadButtons;
