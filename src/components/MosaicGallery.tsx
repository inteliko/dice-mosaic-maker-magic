
import React from 'react';
import AutoScrollingImageRow from '@/components/AutoScrollingImageRow';

const MosaicGallery = () => {
  // First row images (scrolling right to left)
  const firstRowImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  ];

  // Second row images (scrolling right to left as well)
  const secondRowImages = [
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  ];

  return (
    <div className="space-y-8 my-16">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-dice-primary to-purple-600 bg-clip-text text-transparent">
        Mosaic Inspirations
      </h2>
      
      <div className="py-4">
        <AutoScrollingImageRow 
          images={firstRowImages} 
          direction="right" 
          speed={30}
        />
      </div>
      
      <div className="py-4">
        <AutoScrollingImageRow 
          images={secondRowImages} 
          direction="right" 
          speed={40}
        />
      </div>
    </div>
  );
};

export default MosaicGallery;
