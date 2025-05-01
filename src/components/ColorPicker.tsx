
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
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-8 text-center">{faceNumber}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-8 p-0 rounded-md border shadow-sm"
            style={{ backgroundColor: color }}
          >
            <span className="sr-only">Pick a color for dice face {faceNumber}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <div className="flex flex-col gap-2">
            <label htmlFor={`face-${faceNumber}`} className="text-sm font-medium">
              Face {faceNumber} Color
            </label>
            <input
              id={`face-${faceNumber}`}
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-40 h-10 cursor-pointer rounded"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
