
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  faceNumber: number;
  initialColor: string;
  onChange: (faceNumber: number, color: string) => void;
}

const ColorPicker = ({ faceNumber, initialColor, onChange }: ColorPickerProps) => {
  const [color, setColor] = useState(initialColor);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(faceNumber, newColor);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-medium text-sm">Face {faceNumber}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-8 h-8 p-0 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
          >
            <span className="sr-only">Pick a color for dice face {faceNumber}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <div className="flex flex-col gap-2">
            <label htmlFor={`face-${faceNumber}`} className="sr-only">
              Pick a color
            </label>
            <input
              id={`face-${faceNumber}`}
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-32 h-8 cursor-pointer"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
