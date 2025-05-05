
/**
 * Processes an image and returns a 2D array representing the dice values
 */
export const processImage = async (
  imageFile: File,
  gridSize: number | "auto",
  contrast: number
): Promise<number[][]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas to draw and process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(generateRandomGrid(typeof gridSize === "number" ? gridSize : 80)); // Fallback if canvas isn't supported
        return;
      }
      
      // Determine dimensions and optimal grid size
      const aspectRatio = img.width / img.height;
      
      // If auto mode, determine optimal grid size based on image dimensions
      // Base target: around 6000 dice total for high-quality rendering
      let width = typeof gridSize === "number" ? gridSize : Math.round(Math.sqrt(6000 * aspectRatio));
      let height = Math.round(width / aspectRatio);
      
      // Ensure we maintain a reasonable grid size
      if (height > width * 2) {
        height = width;
        width = Math.round(height * aspectRatio);
      }
      
      // Cap grid dimensions for performance while maintaining quality
      const maxDimension = 150; // Increased for better quality
      if (width > maxDimension) {
        width = maxDimension;
        height = Math.round(width / aspectRatio);
      }
      if (height > maxDimension) {
        height = maxDimension;
        width = Math.round(height * aspectRatio);
      }
      
      // Ensure minimum dimensions for visibility
      const minDimension = 50;
      if (width < minDimension) width = minDimension;
      if (height < minDimension) height = minDimension;
      
      // Set canvas size to our grid dimensions with 2x scale for better resolution
      canvas.width = width * 2;
      canvas.height = height * 2;
      
      // Draw image scaled down to our grid size with high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width * 2, height * 2);
      
      // Get image data at higher resolution
      const imageData = ctx.getImageData(0, 0, width * 2, height * 2);
      const data = imageData.data;
      
      // Apply contrast for better dot pattern definition
      // This helps create more defined areas similar to reference images
      const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Convert to grayscale with improved luminance formula
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        
        // Apply enhanced contrast adjustment
        const adjustedGray = Math.min(255, Math.max(0, 
          contrastFactor * (gray - 128) + 128
        ));
        
        // Apply adaptive thresholding for more defined areas
        // This helps create the dotted pattern effect
        const threshold = 128;
        const finalGray = adjustedGray > threshold ? 255 : 0;
        
        // Store back as grayscale
        data[i] = finalGray;
        data[i + 1] = finalGray;
        data[i + 2] = finalGray;
      }
      
      // Put data back to canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Downsample to actual grid size with better quality
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = width;
      finalCanvas.height = height;
      const finalCtx = finalCanvas.getContext('2d');
      
      if (finalCtx) {
        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = "high";
        finalCtx.drawImage(canvas, 0, 0, width * 2, height * 2, 0, 0, width, height);
        
        // Create the dice grid with more defined values for clearer dot patterns
        const diceGrid: number[][] = [];
        const finalImageData = finalCtx.getImageData(0, 0, width, height);
        const finalData = finalImageData.data;
        
        for (let y = 0; y < height; y++) {
          const row: number[] = [];
          for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const grayValue = finalData[index]; // All channels are equal in grayscale
            
            // Map grayscale value to dice face with sharper thresholds
            // This creates more defined areas of dots vs. background
            let diceValue: number;
            
            if (grayValue < 42) {
              diceValue = 6; // Darkest areas get highest value (most dots)
            } else if (grayValue < 85) {
              diceValue = 5;
            } else if (grayValue < 128) {
              diceValue = 4;
            } else if (grayValue < 171) {
              diceValue = 3;
            } else if (grayValue < 213) {
              diceValue = 2;
            } else {
              diceValue = 1; // Lightest areas get lowest value (fewest dots)
            }
            
            row.push(diceValue);
          }
          diceGrid.push(row);
        }
        
        resolve(diceGrid);
      } else {
        // Fallback if final canvas context can't be created
        resolve(generateRandomGrid(typeof gridSize === "number" ? gridSize : 80));
      }
    };
    
    img.onerror = () => {
      // Return a fallback random grid if image can't be loaded
      resolve(generateRandomGrid(typeof gridSize === "number" ? gridSize : 80));
    };
    
    // Start loading the image
    img.src = URL.createObjectURL(imageFile);
  });
};

/**
 * Generates a random grid of dice values (for testing or fallback)
 */
export const generateRandomGrid = (size: number): number[][] => {
  const grid: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      row.push(Math.floor(Math.random() * 6) + 1);
    }
    grid.push(row);
  }
  return grid;
};

/**
 * Generates a sample grid pattern for testing
 */
export const generateSampleGrid = (size: number): number[][] => {
  const grid: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      // Create a gradient pattern
      const value = Math.floor(((i + j) / (2 * size)) * 6) + 1;
      row.push(Math.min(6, Math.max(1, value)));
    }
    grid.push(row);
  }
  return grid;
};
