
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import MosaicControls, { MosaicSettings } from "@/components/MosaicControls";
import DicePreview from "@/components/DicePreview";
import ImageSlider from "@/components/ImageSlider";
import HeroSection from "@/components/HeroSection";
import { processImage, generateSampleGrid } from "@/utils/imageProcessor";
import { Helmet } from "react-helmet";

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
        // Count by face value
        if (byFace[value] !== undefined) {
          byFace[value]++;
        }
      });
    });
    
    return { black, white, byFace };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-dice-primary to-dice-secondary bg-clip-text text-transparent">
              Create Your Dice Mosaic
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Transform any image into a beautiful mosaic made of dice. Upload your photo, adjust the settings, 
              and generate a unique piece of dice art that will impress everyone.
            </p>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">1. Upload Your Image</h2>
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">3. Preview Your Mosaic</h2>
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
            
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">2. Configure Your Mosaic</h2>
              <MosaicControls 
                onGenerate={generateMosaic}
                blackDiceCount={blackDiceCount}
                whiteDiceCount={whiteDiceCount}
                diceColorCounts={diceColorCounts}
              />
            </div>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Inspiration Gallery</h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              Check out these amazing dice mosaics created by our users. Get inspired and create your own masterpiece!
            </p>
            <ImageSlider 
              images={[
                "/public/lovable-uploads/e9d3607d-6988-4ce7-a8bc-3348d3f4f6b7.png",
                "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
                "https://images.unsplash.com/photo-1518770660439-4636190af475",
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
              ]}
              title="User Creations"
            />
          </section>
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Projects</h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              Browse through our collection of professionally designed dice mosaics and see what's possible!
            </p>
            <ImageSlider 
              images={[
                "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
                "https://images.unsplash.com/photo-1500673922987-e212871fec22"
              ]}
              title="Professional Projects"
            />
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
