
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader";
import { processImage } from "@/utils/imageProcessor";
import DicePreview from "@/components/DicePreview";
import Header from "@/components/Header";
import { Slider } from "@/components/ui/slider";

const DICE_PRICE = 0.10;
const MAX_DICE = 10000;

const Calculate = () => {
  const [gridSize, setGridSize] = useState<number>(20);
  const [contrast, setContrast] = useState<number>(50);
  const [diceGrid, setDiceGrid] = useState<number[][]>([]);
  const [blackDiceCount, setBlackDiceCount] = useState(0);
  const [whiteDiceCount, setWhiteDiceCount] = useState(0);
  const { toast } = useToast();

  const totalDice = diceGrid.length > 0 ? diceGrid.length * diceGrid[0].length : 0;
  const totalCost = (totalDice * DICE_PRICE).toFixed(2);

  const handleImageUpload = async (file: File) => {
    try {
      const grid = await processImage(file, gridSize, contrast);
      setDiceGrid(grid);
      // Count black (6) and white (1) dice
      let black = 0;
      let white = 0;
      grid.forEach(row => {
        row.forEach(value => {
          if (value === 6) black++;
          if (value === 1) white++;
        });
      });
      setBlackDiceCount(black);
      setWhiteDiceCount(white);
      
      toast({
        title: "Image processed successfully",
        description: "Your image has been converted to a dice mosaic pattern.",
      });
    } catch (error) {
      toast({
        title: "Error processing image",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Dice Mosaic Generator
        </h1>

        <div className="grid gap-8">
          {/* Image Upload and Settings */}
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-4">Upload Image</h2>
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label>Grid Size (max {MAX_DICE} dice)</Label>
                  <Slider
                    value={[gridSize]}
                    onValueChange={(values) => {
                      const newSize = values[0];
                      if (newSize * newSize <= MAX_DICE) {
                        setGridSize(newSize);
                      }
                    }}
                    min={10}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Current size: {gridSize}x{gridSize} = {gridSize * gridSize} dice
                  </div>
                </div>

                <div>
                  <Label>Contrast</Label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(values) => setContrast(values[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Preview and Results */}
          {diceGrid.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Dice Preview</h2>
                <DicePreview
                  diceGrid={diceGrid}
                  settings={{
                    gridSize,
                    contrast,
                    useShading: true,
                    faceColors: {
                      1: "#FFFFFF",
                      2: "#DDDDDD",
                      3: "#BBBBBB",
                      4: "#888888",
                      5: "#555555",
                      6: "#222222",
                    },
                  }}
                  blackDiceCount={blackDiceCount}
                  whiteDiceCount={whiteDiceCount}
                />
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Dice Summary</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Total Dice</Label>
                      <div className="text-2xl font-bold">{totalDice}</div>
                    </div>
                    <div>
                      <Label>Total Cost</Label>
                      <div className="text-2xl font-bold">${totalCost}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Black Dice (6)</Label>
                      <div className="text-xl">{blackDiceCount}</div>
                    </div>
                    <div>
                      <Label>White Dice (1)</Label>
                      <div className="text-xl">{whiteDiceCount}</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Price per die: ${DICE_PRICE.toFixed(2)}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculate;
