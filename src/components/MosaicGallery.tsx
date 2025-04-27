
import { ImageSlider } from "@/components/ImageSlider";

const MosaicGallery = () => {
  const exampleImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  ];

  const artImages = [
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1518877593221-1f28583780b4"
  ];

  return (
    <div className="space-y-12 my-16">
      <ImageSlider
        images={exampleImages}
        title="Example Dice Mosaics"
      />
      <ImageSlider
        images={artImages}
        title="Art Inspirations"
      />
    </div>
  );
};

export default MosaicGallery;
