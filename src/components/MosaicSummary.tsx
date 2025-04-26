import { FileImage, FileText, ShoppingCart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MosaicSummaryProps {
  width: number;
  height: number;
  blackDiceCount: number;
  whiteDiceCount: number;
  isVisible: boolean;
  onDownloadImage: () => void;
}

const MosaicSummary = ({
  width,
  height,
  blackDiceCount,
  whiteDiceCount,
  isVisible,
  onDownloadImage
}: MosaicSummaryProps) => {
  if (!isVisible) return null;

  // Estimate time based on dice count (roughly 1 minute per 10 dice)
  const totalDice = blackDiceCount + whiteDiceCount;
  const estimatedHours = Math.floor((totalDice / 10) / 60);
  const estimatedMinutes = Math.floor((totalDice / 10) % 60);

  return (
    <div className="mt-8 space-y-8">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold text-lg mb-4">Mosaic Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center border-b py-2">
            <span>Dice Size</span>
            <span className="font-medium">1.6 mm</span>
          </div>
          <div className="flex justify-between items-center border-b py-2">
            <span>Width</span>
            <span className="font-medium">{width.toFixed(2)} cm</span>
          </div>
          <div className="flex justify-between items-center border-b py-2">
            <span>Height</span>
            <span className="font-medium">{height.toFixed(2)} cm</span>
          </div>
          <div className="flex justify-between items-center border-b py-2">
            <span>Estimated Time</span>
            <span className="font-medium">{estimatedHours} hours, {estimatedMinutes} minutes</span>
          </div>
          <div className="flex justify-between items-center border-b py-2">
            <span>Monetary value</span>
            <span className="font-medium text-primary">See Blog</span>
          </div>
          <div className="flex justify-between items-center border-b py-2">
            <span>⬛ Black Dice</span>
            <span className="font-medium">{blackDiceCount}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>⚪ White Dice</span>
            <span className="font-medium">{whiteDiceCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-center text-yellow-500 mb-4">
          Your Mosaic is looking Great!
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          Dice mosaics are an awesome project to keep you entertained and harness your inner creativity! 
          Impress your friends, make a personable gift, or spend some valuable time putting one together 
          with the family. When you are finished, hang it on your wall to show off your amazing skills!
        </p>
        
        <div className="space-y-4">
          <h4 className="font-semibold mb-2">Now what?</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FileImage className="w-5 h-5 text-primary" />
              <span>Save your customized dice art as a png for <span className="font-medium">free!</span></span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Use our dice counter to check how many dice you will need for the project</span>
            </li>
            <li className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span>Head over to our shop where you can purchase the dice in bulk</span>
            </li>
            <li className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Read our blog for tips and tricks about how to create dice mosaics</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={onDownloadImage} className="bg-gray-900 hover:bg-gray-800">
            Generate PNG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MosaicSummary;
