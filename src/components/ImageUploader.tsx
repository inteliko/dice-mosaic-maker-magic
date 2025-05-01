
import { useState, useRef, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageUpload: (imageFile: File) => void;
  id?: string;
}

const ImageUploader = ({ onImageUpload, id }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    onImageUpload(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const sampleImages = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <Button 
        onClick={handleButtonClick}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
      >
        <Upload size={18} />
        Upload Image
      </Button>
      
      <div className="text-center text-xs text-gray-500 my-2">or select a sample</div>
      
      <div className="flex justify-center gap-2">
        {sampleImages.map((image, index) => (
          <button 
            key={index}
            className="rounded-md overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-colors w-14 h-14"
            onClick={() => {
              // This would need to be implemented to load sample images
              toast({
                title: "Sample selected",
                description: `Sample image ${index + 1} selected.`
              });
            }}
          >
            <img 
              src={image} 
              alt={`Sample ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png"
        className="hidden"
        id={id}
      />
    </div>
  );
};

export default ImageUploader;
