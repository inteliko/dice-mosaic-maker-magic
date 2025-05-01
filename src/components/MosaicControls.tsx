
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Ruler, Weight, Move, Circle, Square, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import ColorPicker from "./ColorPicker";

interface MosaicControlsProps {
  onGenerate: (settings: MosaicSettings) => void;
  blackDiceCount?: number;
  whiteDiceCount?: number;
  diceColorCounts?: Record<number, number>;
}

export interface MosaicSettings {
  gridSize: number;
  contrast: number;
  useShading: boolean;
  faceColors: Record<number, string>;
}

const DEFAULT_COLORS: Record<number, string> = {
  1: "#FFFFFF",
  2: "#DDDDDD",
  3: "#BBBBBB",
  4: "#888888",
  5: "#555555",
  6: "#222222",
};

const DICE_SIZE_CM = 1.6;

const MosaicControls = ({ onGenerate, blackDiceCount = 0, whiteDiceCount = 0, diceColorCounts = {} }: MosaicControlsProps) => {
  const [gridSize, setGridSize] = useState(20);
  const [contrast, setContrast] = useState(50);
  const [useShading, setUseShading] = useState(true);
  const [faceColors, setFaceColors] = useState<Record<number, string>>({...DEFAULT_COLORS});

  const handleColorChange = (faceNumber: number, color: string) => {
    setFaceColors((prev) => ({
      ...prev,
      [faceNumber]: color,
    }));
  };

  const handleGenerate = () => {
    onGenerate({
      gridSize,
      contrast,
      useShading,
      faceColors,
    });
  };

  const resetToDefaults = () => {
    setGridSize(20);
    setContrast(50);
    setUseShading(true);
    setFaceColors({...DEFAULT_COLORS});
  };

  const totalDice = gridSize * gridSize;
  const widthCm = gridSize * DICE_SIZE_CM;
  const heightCm = gridSize * DICE_SIZE_CM;

  // Dice icons mapping
  const DiceIcons = {
    1: Dice1,
    2: Dice2,
    3: Dice3,
    4: Dice4,
    5: Dice5,
    6: Dice6,
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="font-medium text-purple-800">Grid Settings</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="grid-size" className="text-sm">Grid Size: {gridSize}×{gridSize}</Label>
            <span className="text-xs text-gray-500">{totalDice} dice</span>
          </div>
          <Slider 
            id="grid-size"
            min={10} 
            max={100} 
            step={1} 
            value={[gridSize]} 
            onValueChange={(values) => setGridSize(values[0])} 
            className="py-2"
          />
          
          <div className="grid grid-cols-1 gap-3 mt-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4" />
              <span>Width: {widthCm.toFixed(1)} cm</span>
            </div>
            <div className="flex items-center gap-2">
              <Weight className="w-4 h-4" />
              <span>Height: {heightCm.toFixed(1)} cm</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              <span>Dice Size: {DICE_SIZE_CM} cm</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="contrast" className="text-sm">Contrast: {contrast}%</Label>
          <Slider 
            id="contrast"
            min={0} 
            max={100} 
            step={1} 
            value={[contrast]} 
            onValueChange={(values) => setContrast(values[0])} 
            className="py-2"
          />
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Switch 
            id="use-shading" 
            checked={useShading} 
            onCheckedChange={setUseShading} 
          />
          <Label htmlFor="use-shading" className="text-sm">Use shading styles</Label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-purple-800">Dice Face Colors</h3>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }, (_, i) => i + 1).map((faceNumber) => (
            <ColorPicker
              key={faceNumber}
              faceNumber={faceNumber}
              initialColor={faceColors[faceNumber]}
              onChange={handleColorChange}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 border rounded-lg bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Dice Count</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map(face => {
            const DiceIcon = DiceIcons[face as keyof typeof DiceIcons];
            return (
              <div 
                key={face} 
                className="flex items-center gap-1 p-2 rounded-lg border" 
                style={{backgroundColor: faceColors[face], color: face > 3 ? "#fff" : "#000"}}
              >
                <DiceIcon className="w-4 h-4" />
                <div className="flex flex-col">
                  <span className="text-xs">{diceColorCounts[face] || 0}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Square className="w-3 h-3" />
            <span>Black: {blackDiceCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3" />
            <span>White: {whiteDiceCount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 mt-6">
        <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleGenerate}>
          Generate Mosaic
        </Button>
        <Button variant="outline" onClick={resetToDefaults} className="w-full">
          Reset Settings
        </Button>
      </div>
    </div>
  );
};

export default MosaicControls;
