
interface DrawDotParams {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
}

export const drawDot = ({ ctx, x, y, size }: DrawDotParams) => {
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
};

export const drawDiceFace = (
  ctx: CanvasRenderingContext2D,
  value: number,
  x: number,
  y: number,
  size: number,
  faceColor: string
) => {
  // Restore more visible dots for better clarity
  const dotSize = size * 0.15;
  const padding = size * 0.2;
  
  // Calculate contrasting color for dots
  const r = parseInt(faceColor.slice(1, 3), 16);
  const g = parseInt(faceColor.slice(3, 5), 16);
  const b = parseInt(faceColor.slice(5, 7), 16);
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
  
  // Use clear contrast for better visibility
  ctx.fillStyle = brightness > 128 ? "#000000" : "#FFFFFF";
  
  // Position dots based on dice value
  switch (value) {
    case 1:
      drawDot({ ctx, x: x + size / 2, y: y + size / 2, size: dotSize });
      break;
    case 2:
      drawDot({ ctx, x: x + padding, y: y + padding, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + size - padding, size: dotSize });
      break;
    case 3:
      drawDot({ ctx, x: x + padding, y: y + padding, size: dotSize });
      drawDot({ ctx, x: x + size / 2, y: y + size / 2, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + size - padding, size: dotSize });
      break;
    case 4:
      drawDot({ ctx, x: x + padding, y: y + padding, size: dotSize });
      drawDot({ ctx, x: x + padding, y: y + size - padding, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + padding, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + size - padding, size: dotSize });
      break;
    case 5:
      drawDot({ ctx, x: x + padding, y: y + padding, size: dotSize });
      drawDot({ ctx, x: x + padding, y: y + size - padding, size: dotSize });
      drawDot({ ctx, x: x + size / 2, y: y + size / 2, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + padding, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + size - padding, size: dotSize });
      break;
    case 6:
      drawDot({ ctx, x: x + padding, y: y + padding, size: dotSize });
      drawDot({ ctx, x: x + padding, y: y + size / 2, size: dotSize });
      drawDot({ ctx, x: x + padding, y: y + size - padding, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + padding, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + size / 2, size: dotSize });
      drawDot({ ctx, x: x + size - padding, y: y + size - padding, size: dotSize });
      break;
  }
};
