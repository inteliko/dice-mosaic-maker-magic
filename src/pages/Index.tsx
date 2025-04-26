import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import MosaicControls, { MosaicSettings } from "@/components/MosaicControls";
import DicePreview from "@/components/DicePreview";
import { processImage, generateSampleGrid } from "@/utils/imageProcessor";

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<MosaicSettings | null>(null);
  const [diceGrid, setDiceGrid] = useState<number[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blackDiceCount, setBlackDiceCount] = useState(0);
  const [whiteDiceCount, setWhiteDiceCount] = useState(0);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setDiceGrid([]);
    setBlackDiceCount(0);
    setWhiteDiceCount(0);
  };

  const generateMosaic = async (newSettings: MosaicSettings) => {
    setSettings(newSettings);
    
    if (!imageFile) {
      const sampleGrid = generateSampleGrid(newSettings.gridSize);
      setDiceGrid(sampleGrid);
      const counts = countDiceColors(sampleGrid);
      setBlackDiceCount(counts.black);
      setWhiteDiceCount(counts.white);
      localStorage.setItem("diceMosaicGrid", JSON.stringify(sampleGrid));
      return;
    }
    
    setIsProcessing(true);
    try {
      const grid = await processImage(
        imageFile, 
        newSettings.gridSize,
        newSettings.contrast
      );
      setDiceGrid(grid);
      const counts = countDiceColors(grid);
      setBlackDiceCount(counts.black);
      setWhiteDiceCount(counts.white);
      localStorage.setItem("diceMosaicGrid", JSON.stringify(grid));
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const countDiceColors = (grid: number[][]) => {
    let black = 0;
    let white = 0;
    
    grid.forEach(row => {
      row.forEach(value => {
        if (value === 6) black++;
        if (value === 1) white++;
      });
    });
    
    return { black, white };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-2">
              Create Your Dice Mosaic
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Transform any image into a beautiful mosaic made of dice
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="font-semibold mb-4">1. Upload Your Image</h2>
                  <ImageUploader onImageUpload={handleImageUpload} />
                </div>
                
                <div>
                  <h2 className="font-semibold mb-4">2. Configure Your Mosaic</h2>
                  <MosaicControls 
                    onGenerate={generateMosaic}
                    blackDiceCount={blackDiceCount}
                    whiteDiceCount={whiteDiceCount}
                  />
                </div>
              </div>
              
              <div>
                <h2 className="font-semibold mb-4">3. Preview Your Mosaic</h2>
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-white h-96">
                    <div className="w-12 h-12 border-4 border-dice-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Processing your image...</p>
                  </div>
                ) : (
                  <DicePreview 
                    diceGrid={diceGrid} 
                    settings={settings || {
                      gridSize: 20,
                      contrast: 50,
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
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
