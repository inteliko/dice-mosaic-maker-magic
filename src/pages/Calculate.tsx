
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Upload, Plus, Minus } from "lucide-react";

const DICE_PRICE = 0.10;

const Calculate = () => {
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(0);

  const totalDice = width * height;
  const totalCost = (totalDice * DICE_PRICE).toFixed(2);

  const handleIncrease = (setter: (value: number) => void, current: number) => {
    setter(current + 1);
  };

  const handleDecrease = (setter: (value: number) => void, current: number) => {
    if (current > 0) {
      setter(current - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Dice mosaic generator (prepare your image to recreate it using only dice)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Image</h2>
            <Button className="w-full gap-2">
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold mb-4">Desired Size</h2>
            <div className="space-y-4">
              <div>
                <Label>Width</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDecrease(setWidth, width)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-24 text-center"
                  />
                  <span>cm</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrease(setWidth, width)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Height</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDecrease(setHeight, height)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-24 text-center"
                  />
                  <span>cm</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrease(setHeight, height)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold mb-4">Cost Estimate (16mm)</h2>
            <div className="space-y-4">
              <div className="text-lg">{totalDice} Dice @</div>
              <div className="flex items-center gap-2">
                <span>$</span>
                <Input
                  type="number"
                  value={DICE_PRICE}
                  readOnly
                  className="w-24 text-center"
                />
              </div>
              <div className="text-xl font-bold">= ${totalCost}</div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold mb-4">Export</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="invert" />
                <label htmlFor="invert">Invert (black dice)</label>
              </div>
              <Button className="w-full">Open output</Button>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setting</TableHead>
                <TableHead>Controls</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Contrast</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDecrease(setContrast, contrast)}
                    >
                      - Decrease
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleIncrease(setContrast, contrast)}
                    >
                      + Increase
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{contrast}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brightness</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDecrease(setBrightness, brightness)}
                    >
                      - Decrease
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleIncrease(setBrightness, brightness)}
                    >
                      + Increase
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{brightness}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">How to Use</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Upload your image</li>
            <li>Adjust size, contrast, and brightness</li>
            <li>Open output for a printable list of dice numbers</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default Calculate;
