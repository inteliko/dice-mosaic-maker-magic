
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

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    // Clear previous results when a new image is uploaded
    setDiceGrid([]);
  };

  const generateMosaic = async (newSettings: MosaicSettings) => {
    setSettings(newSettings);
    
    if (!imageFile) {
      // For demo purposes, generate a sample grid if no image is uploaded
      const sampleGrid = generateSampleGrid(newSettings.gridSize);
      setDiceGrid(sampleGrid);
      // Save to localStorage for the Export page
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
      // Save to localStorage for the Export page
      localStorage.setItem("diceMosaicGrid", JSON.stringify(grid));
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
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
                  <MosaicControls onGenerate={generateMosaic} />
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
                  />
                )}
              </div>
            </div>
          </section>
          
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-dice-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-dice-primary text-xl">1</span>
                </div>
                <h3 className="font-medium mb-2">Upload</h3>
                <p className="text-gray-600 text-sm">
                  Upload any image you want to transform into a dice mosaic
                </p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-dice-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-dice-primary text-xl">2</span>
                </div>
                <h3 className="font-medium mb-2">Configure</h3>
                <p className="text-gray-600 text-sm">
                  Set the size of your mosaic and adjust contrast for better results
                </p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-dice-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-dice-primary text-xl">3</span>
                </div>
                <h3 className="font-medium mb-2">Create</h3>
                <p className="text-gray-600 text-sm">
                  Download your mosaic as an image or as a CSV grid for physical assembly
                </p>
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
