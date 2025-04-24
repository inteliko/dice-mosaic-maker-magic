
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiceDownloadButtonsProps {
  onDownloadImage: () => void;
  onDownloadCSV: () => void;
}

const DiceDownloadButtons = ({ onDownloadImage, onDownloadCSV }: DiceDownloadButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      <Button 
        variant="outline"
        className="flex items-center gap-1"
        onClick={onDownloadImage}
      >
        <Download size={16} />
        Download Image
      </Button>
      <Button 
        variant="outline"
        className="flex items-center gap-1"
        onClick={onDownloadCSV}
      >
        <Download size={16} />
        Download CSV
      </Button>
    </div>
  );
};

export default DiceDownloadButtons;
