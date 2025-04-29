
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageUpload: (imageFile: File) => void;
  id?: string;
}

const ImageUploader = ({ onImageUpload, id }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

    setPreviewUrl(URL.createObjectURL(file));
    onImageUpload(file);
  };

  return (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept=".jpg,.jpeg,.png"
      className="hidden"
      id={id}
    />
  );
};

export default ImageUploader;
