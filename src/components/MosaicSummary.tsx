import { FileImage, FileText, ShoppingCart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MosaicSummaryProps {
  width: number;
  height: number;
  blackDiceCount: number;
  whiteDiceCount: number;
  isVisible: boolean;
  onDownloadImage: () => void;
  diceColors?: Record<string, number>;
}

const MosaicSummary = ({
  width,
  height,
  blackDiceCount,
  whiteDiceCount,
  isVisible,
  onDownloadImage,
  diceColors = {}
}: MosaicSummaryProps) => {
  if (!isVisible) return null;

  const totalDice = blackDiceCount + whiteDiceCount;
  const estimatedHours = Math.floor((totalDice / 10) / 60);
  const estimatedMinutes = Math.floor((totalDice / 10) % 60);

  return (
    <div className="mt-8 space-y-8">
      <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border">
        <div className="mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Your Mosaic is looking Great!
          </h3>
          <p className="text-gray-600">
            Dice mosaics are an awesome project to keep you entertained and harness your inner creativity! 
            Impress your friends, make a personable gift, or spend some valuable time putting one together 
            with the family. When you are finished, hang it on your wall to show off your amazing skills!
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h4 className="font-semibold text-lg mb-3 text-purple-800">1. Size Settings</h4>
            <div className="grid grid-cols-2 gap-4 pl-4">
              <div className="flex justify-between items-center text-sm">
                <span>Width</span>
                <span className="font-medium">{width.toFixed(2)} cm</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Height</span>
                <span className="font-medium">{height.toFixed(2)} cm</span>
              </div>
            </div>
          </section>
          
          <section>
            <h4 className="font-semibold text-lg mb-3 text-purple-800">2. Time Estimate</h4>
            <div className="pl-4">
              <div className="flex justify-between items-center text-sm">
                <span>Estimated Time</span>
                <span className="font-medium">{estimatedHours}h {estimatedMinutes}m</span>
              </div>
            </div>
          </section>
          
          <section>
            <h4 className="font-semibold text-lg mb-3 text-purple-800">3. Dice Count</h4>
            <div className="space-y-2 pl-4">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-900 rounded-full" />
                  Black Dice
                </span>
                <span className="font-medium">{blackDiceCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border rounded-full" />
                  White Dice
                </span>
                <span className="font-medium">{whiteDiceCount}</span>
              </div>
            </div>
          </section>
          
          <section>
            <h4 className="font-semibold text-lg mb-3 text-purple-800">4. Color Distribution</h4>
            <div className="space-y-2 pl-4">
              {Object.entries(diceColors).map(([color, count]) => (
                <div key={color} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    Face {color}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="font-semibold text-lg text-purple-800">Now what?</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FileImage className="w-5 h-5 text-purple-600" />
              <span>Save your customized dice art as a png for free!</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Use our dice counter to check how many dice you will need for the project</span>
            </li>
            <li className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
              <span>Head over to our shop where you can purchase the dice in bulk</span>
            </li>
            <li className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Read our blog for tips and tricks about how to create dice mosaics</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={onDownloadImage}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Generate PNG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MosaicSummary;
