import { FileImage, FileText, ShoppingCart, BookOpen, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  if (!isVisible) return null;

  const totalDice = blackDiceCount + whiteDiceCount;
  const estimatedHours = Math.floor((totalDice / 10) / 60);
  const estimatedMinutes = Math.floor((totalDice / 10) % 60);

  return (
    <div className="mt-8 space-y-8">
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Mosaic Summary</h3>
          <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {isSettingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4 border-t pt-4">
              <div className="space-y-4">
                <section>
                  <h4 className="font-medium mb-2">1. Size Settings</h4>
                  <div className="space-y-2 pl-4">
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
                  <h4 className="font-medium mb-2">2. Time Estimate</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Estimated Time</span>
                      <span className="font-medium">{estimatedHours}h {estimatedMinutes}m</span>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h4 className="font-medium mb-2">3. Dice Count</h4>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>⬛ Black Dice</span>
                      <span className="font-medium">{blackDiceCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>⚪ White Dice</span>
                      <span className="font-medium">{whiteDiceCount}</span>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h4 className="font-medium mb-2">4. Color Distribution</h4>
                  <div className="space-y-2 pl-4">
                    {Object.entries(diceColors).map(([color, count]) => (
                      <div key={color} className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          {color}
                        </span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </CollapsibleContent>
          </Collapsible>
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
    </div>
  );
};

export default MosaicSummary;
