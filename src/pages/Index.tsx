
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ControlSidebar from "@/components/ControlSidebar";
import DicePreview from "@/components/DicePreview";
import HeroSection from "@/components/HeroSection";
import { MosaicSettings } from "@/components/MosaicControls";
import { processImage, generateSampleGrid } from "@/utils/imageProcessor";
import { Helmet } from "react-helmet";
import MosaicGallery from "@/components/MosaicGallery";

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<MosaicSettings | null>(null);
  const [diceGrid, setDiceGrid] = useState<number[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blackDiceCount, setBlackDiceCount] = useState(0);
  const [whiteDiceCount, setWhiteDiceCount] = useState(0);
  const [diceColorCounts, setDiceColorCounts] = useState<Record<number, number>>({});
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if we have a preset image from navigation state
    if (location.state && (location.state as any).presetImageUrl) {
      const presetUrl = (location.state as any).presetImageUrl;
      setImageUrl(presetUrl);
      processPresetImage(presetUrl);
    }
  }, [location.state]);

  const processPresetImage = async (url: string) => {
    setIsProcessing(true);
    try {
      // Fetch the image from URL
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "preset-image.jpg", { type: blob.type });
      
      setImageFile(file);
      
      // Generate mosaic with default settings
      const defaultSettings = {
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
        }
      };
      
      const grid = await processImage(
        file, 
        defaultSettings.gridSize,
        defaultSettings.contrast
      );
      
      setDiceGrid(grid);
      setSettings(defaultSettings);
      setShowPreview(true);
      
      const counts = countDiceColors(grid, defaultSettings.faceColors);
      setBlackDiceCount(counts.black);
      setWhiteDiceCount(counts.white);
      setDiceColorCounts(counts.byFace);
      
      localStorage.setItem("diceMosaicGrid", JSON.stringify(grid));
    } catch (error) {
      console.error("Error processing preset image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (file: File) => {
    // If an empty file was passed, clear the current image
    if (file.size === 0) {
      setImageFile(null);
      setImageUrl(null);
      setDiceGrid([]);
      setShowPreview(false);
      return;
    }
    
    setImageFile(file);
    setImageUrl(null);
    setDiceGrid([]);
    setBlackDiceCount(0);
    setWhiteDiceCount(0);
    setDiceColorCounts({});
    setSidebarOpen(true);
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
      setShowPreview(true);
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
      setShowPreview(true);
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

  // Toggle function for the control sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Helmet>
        <title>Dice Mosaic Generator | Transform Images into Dice Art</title>
        <meta name="description" content="Create beautiful dice mosaics from your images. Transform photos into unique artwork made entirely of dice." />
      </Helmet>
      
      <Header />
      
      {/* Control Sidebar */}
      <ControlSidebar
        onGenerate={generateMosaic}
        imageFile={imageFile}
        onImageUpload={handleImageUpload}
        blackDiceCount={blackDiceCount}
        whiteDiceCount={whiteDiceCount}
        diceColorCounts={diceColorCounts}
        isOpen={isSidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      
      <main className="flex-grow transition-all duration-300">
        <HeroSection />
        
        <div className="container mx-auto px-4">
          {/* Toggle Controls Button - centered at the top where the section header used to be */}
          <div className="flex justify-center my-6">
            <button
              onClick={toggleSidebar}
              className="bg-purple-700 hover:bg-purple-800 text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-md transition-colors duration-300"
            >
              {isSidebarOpen ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="9" y1="3" y2="21"/>
                  </svg>
                  Close Controls
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-right">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="15" x2="15" y1="3" y2="21"/>
                  </svg>
                  Open Controls
                </>
              )}
            </button>
          </div>
          
          {/* Preview section - only shown when there's something to preview */}
          <div className="max-w-5xl mx-auto">
            {(isProcessing || showPreview) && (
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-16">
                <h2 className="text-xl font-semibold mb-4 text-purple-800">Preview Your Mosaic</h2>
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-white h-96">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Processing your image...</p>
                  </div>
                ) : (
                  <div className="fixed-preview overflow-hidden">
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
                      isVisible={showPreview}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <MosaicGallery />
        </div>
      </main>
      
      <Footer />
      
      {/* Fixed styling for the preview container */}
      <style>
        {`
        .fixed-preview {
          max-height: 70vh;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border-radius: 0.5rem;
        }
        
        /* Hide the unclear parts by showing only the center of the preview */
        .fixed-preview > div {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .fixed-preview {
            max-height: 50vh;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Index;
