import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import MosaicControls, { MosaicSettings } from "@/components/MosaicControls";
import DicePreview from "@/components/DicePreview";
import HeroSection from "@/components/HeroSection";
import { processImage, generateSampleGrid } from "@/utils/imageProcessor";
import { Helmet } from "react-helmet";
import MosaicGallery from "@/components/MosaicGallery";

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<MosaicSettings | null>(null);
  const [diceGrid, setDiceGrid] = useState<number[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blackDiceCount, setBlackDiceCount] = useState(0);
  const [whiteDiceCount, setWhiteDiceCount] = useState(0);
  const [diceColorCounts, setDiceColorCounts] = useState<Record<number, number>>({});

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setDiceGrid([]);
    setBlackDiceCount(0);
    setWhiteDiceCount(0);
    setDiceColorCounts({});
  };

  const generateMosaic = async (newSettings: MosaicSettings) => {
    setSettings(newSettings);
    
    if (!imageFile) {
      const sampleGrid = generateSampleGrid(newSettings.gridSize);
      setDiceGrid(sampleGrid);
      const counts = countDiceColors(sampleGrid, newSettings.faceColors);
      setBlackDiceCount(counts.black);
      setWhiteDiceCount(counts.white);
      setDiceColorCounts(counts.byFace);
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
      const counts = countDiceColors(grid, newSettings.faceColors);
      setBlackDiceCount(counts.black);
      setWhiteDiceCount(counts.white);
      setDiceColorCounts(counts.byFace);
      localStorage.setItem("diceMosaicGrid", JSON.stringify(grid));
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const countDiceColors = (grid: number[][], faceColors: Record<number, string>) => {
    let black = 0;
    let white = 0;
    const byFace: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    };
    
    grid.forEach(row => {
      row.forEach(value => {
        if (value === 6) black++;
        if (value === 1) white++;
        if (byFace[value] !== undefined) {
          byFace[value]++;
        }
      });
    });
    
    return { black, white, byFace };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Helmet>
        <title>Dice Mosaic Generator | Transform Images into Dice Art</title>
        <meta name="description" content="Create beautiful dice mosaics from your images. Transform photos into unique artwork made entirely of dice." />
        <meta name="keywords" content="dice mosaic, dice art, image to dice, mosaic generator, dice artwork" />
        <meta property="og:title" content="Dice Mosaic Generator | Transform Images into Dice Art" />
        <meta property="og:description" content="Create beautiful dice mosaics from your images. Transform photos into unique artwork made entirely of dice." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dicemosaicgenerator.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dice Mosaic Generator | Transform Images into Dice Art" />
        <meta name="twitter:description" content="Create beautiful dice mosaics from your images. Transform photos into unique artwork made entirely of dice." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <div className="container mx-auto py-16 px-4">
          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-dice-primary to-purple-600 bg-clip-text text-transparent">
              Create Your Dice Mosaic
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Transform any image into a beautiful mosaic made of dice. Upload your photo, adjust the settings, 
              and generate a unique piece of dice art that will impress everyone.
            </p>
          </section>
          
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">1. Upload Your Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">2. Configure Your Mosaic</h2>
              <MosaicControls 
                onGenerate={generateMosaic}
                blackDiceCount={blackDiceCount}
                whiteDiceCount={whiteDiceCount}
                diceColorCounts={diceColorCounts}
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">3. Preview Your Mosaic</h2>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-white h-96">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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

          <MosaicGallery />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
