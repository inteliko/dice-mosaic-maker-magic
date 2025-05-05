import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "@/components/ImageUploader";
import { processImage } from "@/utils/imageProcessor";
import Header from "@/components/Header";
import { FileDown, Plus, Minus } from "lucide-react";
import DicePreview from "@/components/DicePreview";
import DiceCanvas from "@/components/DiceCanvas";

const DICE_PRICE = 0.10;
const MAX_DICE = 10000;
const DEFAULT_SIZE = 50;

const Calculate = () => {
  const [width, setWidth] = useState<number>(DEFAULT_SIZE);
  const [height, setHeight] = useState<number>(DEFAULT_SIZE);
  const [contrast, setContrast] = useState<number>(50);
  const [brightness, setBrightness] = useState<number>(50);
  const [invertColors, setInvertColors] = useState<boolean>(false);
  const [diceGrid, setDiceGrid] = useState<number[][]>([]);
  const [diceCount, setDiceCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [settings, setSettings] = useState({
    gridSize: DEFAULT_SIZE,
    contrast: 50,
    useShading: true,
    diceSizeMm: 1.6,
    faceColors: {
      1: "#FFFFFF",
      2: "#DDDDDD",
      3: "#BBBBBB",
      4: "#888888",
      5: "#555555",
      6: "#222222",
    }
  });
  const { toast } = useToast();

  // Calculate counts of each dice face
  const diceColorCounts = diceGrid.reduce((acc, row) => {
    row.forEach(value => {
      acc[value] = (acc[value] || 0) + 1;
    });
    return acc;
  }, {} as Record<number, number>);

  // Count black and white dice (faces 1 and 6)
  const whiteDiceCount = diceColorCounts[1] || 0;
  const blackDiceCount = diceColorCounts[6] || 0;

  // Calculate total cost - Using the width * height to get accurate dice count
  const calculatedDiceCount = width * height;
  const totalCost = (calculatedDiceCount * DICE_PRICE).toFixed(2);

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      toast({
        title: "Processing image",
        description: "Please wait while we convert your image to dice...",
      });
      
      // Calculate grid size based on width/height
      const gridSize = Math.max(width, height);
      
      const grid = await processImage(file, gridSize, contrast);
      setDiceGrid(grid);
      
      // Count dice
      const totalDice = grid.length * grid[0].length;
      setDiceCount(totalDice);
      
      setSettings(prev => ({
        ...prev,
        gridSize,
        contrast,
      }));
      
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
    } finally {
      setIsProcessing(false);
    }
  };

  const increaseSize = () => {
    if (width * height < MAX_DICE) {
      setWidth(prev => Math.min(prev + 10, 100));
      setHeight(prev => Math.min(prev + 10, 100));
    } else {
      toast({
        title: "Maximum size reached",
        description: `You cannot exceed ${MAX_DICE} dice in total.`,
        variant: "destructive",
      });
    }
  };

  const decreaseSize = () => {
    setWidth(prev => Math.max(prev - 10, 10));
    setHeight(prev => Math.max(prev - 10, 10));
  };

  const increaseContrast = () => {
    setContrast(prev => Math.min(prev + 10, 100));
  };

  const decreaseContrast = () => {
    setContrast(prev => Math.max(prev - 10, 0));
  };

  const increaseBrightness = () => {
    setBrightness(prev => Math.min(prev + 10, 100));
  };

  const decreaseBrightness = () => {
    setBrightness(prev => Math.max(prev - 10, 0));
  };

  const openOutput = () => {
    toast({
      title: "Opening output",
      description: "Preparing dice layout for printing...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Dice mosaic generator (prepare your image to recreate it using only dice)
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Top Section: Controls */}
          <Card className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
              {/* Image Upload */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Image</Label>
                <ImageUploader onImageUpload={handleImageUpload} id="imageUploader" />
              </div>

              {/* Desired Size */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Desired Size</Label>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1 min-w-0"
                    onClick={decreaseSize}
                    disabled={isProcessing}
                  >
                    <Minus size={16} /> <span className="truncate">Decrease</span>
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1 min-w-0"
                    onClick={increaseSize}
                    disabled={isProcessing}
                  >
                    <Plus size={16} /> <span className="truncate">Increase</span>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Label className="w-16">Width</Label>
                    <Input 
                      type="number" 
                      value={width} 
                      onChange={e => setWidth(Math.min(parseInt(e.target.value) || 10, 100))} 
                      className="w-24" 
                      disabled={isProcessing}
                    />
                    <span className="ml-2">cm</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Label className="w-16">Height</Label>
                    <Input 
                      type="number" 
                      value={height} 
                      onChange={e => setHeight(Math.min(parseInt(e.target.value) || 10, 100))} 
                      className="w-24" 
                      disabled={isProcessing}
                    />
                    <span className="ml-2">cm</span>
                  </div>
                </div>
              </div>

              {/* Cost Estimate */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Cost Estimate (16mm)</Label>
                
                <div className="mb-4">
                  <p>{calculatedDiceCount} Dice @</p>
                </div>
                
                <div className="flex items-center mb-4">
                  <span className="mr-2">$</span>
                  <Input 
                    type="text" 
                    value={DICE_PRICE.toFixed(2)} 
                    readOnly 
                    className="w-16 bg-gray-50"
                  />
                </div>
                
                <div className="font-medium">
                  = ${totalCost}
                </div>
              </div>

              {/* Export */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Export</Label>
                
                <div className="mb-4 flex items-center">
                  <Checkbox 
                    id="invertColors" 
                    checked={invertColors}
                    onCheckedChange={(checked) => setInvertColors(!!checked)}
                  />
                  <label htmlFor="invertColors" className="ml-2 text-sm font-medium">
                    Invert (black dice)
                  </label>
                </div>
                
                <Button 
                  variant="default" 
                  className="bg-blue-300 hover:bg-blue-400 text-white w-full"
                  onClick={openOutput}
                  disabled={diceGrid.length === 0}
                >
                  Open output
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Middle Section: Contrast and Brightness Controls */}
          <Card className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
              {/* Contrast Control */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Contrast</Label>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                    onClick={decreaseContrast}
                    disabled={isProcessing}
                  >
                    <Minus size={16} /> Decrease
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                    onClick={increaseContrast}
                    disabled={isProcessing}
                  >
                    <Plus size={16} /> Increase
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    value={contrast} 
                    onChange={e => setContrast(parseInt(e.target.value) || 0)} 
                    className="w-16" 
                    disabled={isProcessing}
                  />
                </div>
              </div>
              
              {/* Brightness Control */}
              <div className="p-4">
                <Label className="text-lg font-medium mb-4 block">Brightness</Label>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                    onClick={decreaseBrightness}
                    disabled={isProcessing}
                  >
                    <Minus size={16} /> Decrease
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                    onClick={increaseBrightness}
                    disabled={isProcessing}
                  >
                    <Plus size={16} /> Increase
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    value={brightness} 
                    onChange={e => setBrightness(parseInt(e.target.value) || 0)} 
                    className="w-16" 
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Preview Area */}
          <div className="mb-4">
            {diceGrid.length === 0 ? (
              <div className="h-64 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2RkZCIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2RkZCIvPgo8L3N2Zz4=')] flex items-center justify-center rounded-lg">
                <p className="text-sm text-gray-500">Upload an image and generate a dice mosaic to see the preview</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg border">
                <DiceCanvas
                  diceGrid={diceGrid}
                  settings={settings}
                  onCanvasReady={() => {}}
                />
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <Card className="p-6 mb-4">
            <h2 className="text-xl font-bold mb-4">How to Use</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Upload your image</li>
              <li>Adjust size, contrast, and brightness</li>
              <li>Open output for a printable list of dice numbers</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculate;
