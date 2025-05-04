
/**
 * Processes an image and returns a 2D array representing the dice values
 */
export const processImage = async (
  imageFile: File,
  gridSize: number,
  contrast: number
): Promise<number[][]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas to draw and process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(generateRandomGrid(gridSize)); // Fallback if canvas isn't supported
        return;
      }
      
      // Determine dimensions
      const aspectRatio = img.width / img.height;
      let width = gridSize;
      let height = Math.round(gridSize / aspectRatio);
      
      // Ensure we maintain the requested grid size
      if (height > gridSize) {
        height = gridSize;
        width = Math.round(gridSize * aspectRatio);
      }
      
      // Cap grid dimensions to avoid performance issues
      const maxDimension = 200; // Allow for larger grids while maintaining performance
      if (width > maxDimension) {
        width = maxDimension;
        height = Math.round(width / aspectRatio);
      }
      if (height > maxDimension) {
        height = maxDimension;
        width = Math.round(height * aspectRatio);
      }
      
      // Set canvas size to our grid dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image scaled down to our grid size
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // Apply stronger contrast for better dot pattern definition
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
        
        // Apply thresholding for more defined black and white areas
        // This helps create the dotted pattern effect seen in reference images
        const threshold = 128;
        const finalGray = adjustedGray > threshold ? 255 : 0;
        
        // Store back as grayscale
        data[i] = finalGray;
        data[i + 1] = finalGray;
        data[i + 2] = finalGray;
      }
      
      // Put data back to canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Create the dice grid with more defined values for clearer dot patterns
      const diceGrid: number[][] = [];
      for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const grayValue = data[index]; // All channels are equal in grayscale
          
          // Map grayscale value to dice face with sharper thresholds
          // This creates more defined areas of dots vs. background
          let diceValue: number;
          
          if (grayValue === 0) {
            diceValue = 6; // Pure black areas get highest value (most dots)
          } else if (grayValue === 255) {
            diceValue = 1; // Pure white areas get lowest value (fewest dots)
          } else {
            // For any middle values (shouldn't exist after thresholding)
            diceValue = Math.floor((255 - grayValue) / 43) + 1;
          }
          
          row.push(Math.min(6, Math.max(1, diceValue)));
        }
        diceGrid.push(row);
      }
      
      // Create a square grid
      const squareGrid: number[][] = [];
      for (let y = 0; y < gridSize; y++) {
        const row: number[] = [];
        for (let x = 0; x < gridSize; x++) {
          if (y < diceGrid.length && x < diceGrid[0].length) {
            row.push(diceGrid[y][x]);
          } else {
            // Fill extra space with empty dice (1)
            row.push(1);
          }
        }
        squareGrid.push(row);
      }
      
      resolve(squareGrid);
    };
    
    img.onerror = () => {
      // Return a fallback random grid if image can't be loaded
      resolve(generateRandomGrid(gridSize));
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
