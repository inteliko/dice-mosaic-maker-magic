import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Ruler, Weight, Move } from "lucide-react";
import ColorPicker from "./ColorPicker";

interface MosaicControlsProps {
  onGenerate: (settings: MosaicSettings) => void;
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

const MosaicControls = ({ onGenerate }: MosaicControlsProps) => {
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

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label htmlFor="grid-size">Grid Size: {gridSize}×{gridSize}</Label>
          <span className="text-sm text-gray-500">{totalDice} dice</span>
        </div>
        <Slider 
          id="grid-size"
          min={10} 
          max={100} 
          step={1} 
          value={[gridSize]} 
          onValueChange={(values) => setGridSize(values[0])} 
        />
        
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
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

      <div className="space-y-3">
        <Label htmlFor="contrast">Contrast: {contrast}%</Label>
        <Slider 
          id="contrast"
          min={0} 
          max={100} 
          step={1} 
          value={[contrast]} 
          onValueChange={(values) => setContrast(values[0])} 
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="use-shading" 
          checked={useShading} 
          onCheckedChange={setUseShading} 
        />
        <Label htmlFor="use-shading">Use shading styles</Label>
      </div>

      <div className="space-y-3">
        <Label>Dice Face Colors</Label>
        <div className="grid grid-cols-2 gap-3">
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

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mt-6">
        <Button className="bg-dice-primary hover:bg-dice-secondary" onClick={handleGenerate}>
          Generate Mosaic
        </Button>
        <Button variant="outline" onClick={resetToDefaults}>
          Reset Settings
        </Button>
      </div>
    </div>
  );
};

export default MosaicControls;
