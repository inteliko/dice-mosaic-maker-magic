
import { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import ImageUploader from "./ImageUploader";
import MosaicControls, { MosaicSettings } from "./MosaicControls";
import { cn } from "@/lib/utils";

interface ControlSidebarProps {
  onGenerate: (settings: MosaicSettings) => void;
  imageFile: File | null;
  onImageUpload: (file: File) => void;
  blackDiceCount: number;
  whiteDiceCount: number;
  diceColorCounts: Record<number, number>;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const ControlSidebar = ({
  onGenerate,
  imageFile,
  onImageUpload,
  blackDiceCount,
  whiteDiceCount,
  diceColorCounts,
  isOpen: propIsOpen,
  onOpenChange
}: ControlSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <>
      {/* Mobile trigger */}
      <div className="fixed top-20 left-4 z-40 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full shadow-md bg-white hover:bg-purple-100"
          onClick={() => handleOpenChange(true)}
        >
          <Settings className="h-6 w-6 text-purple-600" />
          <span className="sr-only">Open controls</span>
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-lg text-purple-800">Dice Mosaic Controls</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleOpenChange(false)}
              className="hover:bg-purple-100"
            >
              <X className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Close controls</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-3">
              <h3 className="font-medium text-purple-800">Image Upload</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="mx-auto overflow-hidden rounded-md border-2 border-purple-200 shadow-sm max-w-xs">
                      <img 
                        src={previewUrl} 
                        alt="Selected" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        className="text-sm w-full"
                        onClick={() => {
                          onImageUpload(new File([], ""));
                          setPreviewUrl(null);
                        }}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ImageUploader
                    onImageUpload={onImageUpload}
                  />
                )}
              </div>
            </div>

            {/* Mosaic Controls */}
            <MosaicControls 
              onGenerate={onGenerate}
              blackDiceCount={blackDiceCount}
              whiteDiceCount={whiteDiceCount}
              diceColorCounts={diceColorCounts}
            />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => handleOpenChange(false)}
        ></div>
      )}

      {/* Desktop trigger */}
      <div className="fixed top-20 left-4 z-30 hidden md:block">
        <Button 
          variant={isOpen ? "ghost" : "outline"}
          size="icon" 
          className={cn(
            "rounded-full shadow-md transition-all",
            isOpen ? "bg-transparent hover:bg-transparent" : "bg-white hover:bg-purple-100"
          )}
          onClick={() => handleOpenChange(!isOpen)}
        >
          <Settings className={cn(
            "h-6 w-6",
            isOpen ? "text-white" : "text-purple-600"
          )} />
          <span className="sr-only">Toggle controls</span>
        </Button>
      </div>
    </>
  );
};

export default ControlSidebar;
