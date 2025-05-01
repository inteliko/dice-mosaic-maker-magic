
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Sparkles, Rocket } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Preset images for quick selection
  const presetImages = [
    {
      name: "Mountain Landscape",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
    },
    {
      name: "City Skyline",
      thumbnail: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
      url: "https://images.unsplash.com/photo-1518877593221-1f28583780b4"
    },
    {
      name: "Abstract Art",
      thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      url: "https://images.unsplash.com/photo-1500673922987-e212871fec22"
    }
  ];

  const handlePresetSelect = (imageUrl: string) => {
    setSelectedPreset(imageUrl);
    // Create a data transfer object to pass to generate mosaic
    const dataToPass = { presetImageUrl: imageUrl };
    navigate('/', { state: dataToPass });
  };

  const handleGetStarted = () => {
    navigate('/');
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7954c4); // Slightly deeper purple for more professional look

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 20;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Improved lighting for more professional look
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Add a subtle spotlight for dramatic effect
    const spotlight = new THREE.SpotLight(0xffffff, 0.8);
    spotlight.position.set(0, 15, 15);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.2;
    scene.add(spotlight);

    // Calculate the visible width at camera z-position for full width distribution
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
    const visibleWidth = visibleHeight * camera.aspect;

    // Create an array to hold all dice objects
    const diceObjects: { mesh: THREE.Mesh; rotVel: {x: number, y: number, z: number}; vel: {x: number, y: number, z: number} }[] = [];
    
    // Adjust values based on screen size
    const isMobileView = window.innerWidth < 768;
    
    // Dice creation function with responsive sizing
    const createDice = () => {
      // Smaller dice size on mobile
      const diceSize = isMobileView ? 1.5 : 2;
      const geometry = new THREE.BoxGeometry(diceSize, diceSize, diceSize);
      
      // More professional materials with subtle shine
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.2,
      });
      
      const dice = new THREE.Mesh(geometry, material);
      
      // Add dice dots (all faces)
      const addDot = (x: number, y: number, z: number) => {
        // Smaller dots for mobile
        const dotSize = isMobileView ? 0.15 : 0.18;
        const dotGeo = new THREE.SphereGeometry(dotSize, 16, 16);
        const dotMat = new THREE.MeshStandardMaterial({ 
          color: 0x222222,
          roughness: 0.3,
          metalness: 0.1
        });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(x, y, z);
        dice.add(dot);
      };
      
      // Randomly select a dice face (1-6)
      const diceFace = Math.floor(Math.random() * 6) + 1;
      
      switch(diceFace) {
        case 1:
          // Center dot
          addDot(0, -diceSize/2 - 0.01, 0);
          break;
        case 2:
          // Two diagonal dots
          addDot(-diceSize/4, -diceSize/2 - 0.01, -diceSize/4);
          addDot(diceSize/4, -diceSize/2 - 0.01, diceSize/4);
          break;
        case 3:
          // Three diagonal dots
          addDot(-diceSize/4, -diceSize/2 - 0.01, -diceSize/4);
          addDot(0, -diceSize/2 - 0.01, 0);
          addDot(diceSize/4, -diceSize/2 - 0.01, diceSize/4);
          break;
        case 4:
          // Four corner dots
          addDot(-diceSize/4, -diceSize/2 - 0.01, -diceSize/4);
          addDot(-diceSize/4, -diceSize/2 - 0.01, diceSize/4);
          addDot(diceSize/4, -diceSize/2 - 0.01, -diceSize/4);
          addDot(diceSize/4, -diceSize/2 - 0.01, diceSize/4);
          break;
        case 5:
          // Four corner dots + center
          addDot(-diceSize/4, -diceSize/2 - 0.01, -diceSize/4);
          addDot(-diceSize/4, -diceSize/2 - 0.01, diceSize/4);
          addDot(0, -diceSize/2 - 0.01, 0);
          addDot(diceSize/4, -diceSize/2 - 0.01, -diceSize/4);
          addDot(diceSize/4, -diceSize/2 - 0.01, diceSize/4);
          break;
        case 6:
          // Six dots in two rows
          addDot(-diceSize/4, -diceSize/2 - 0.01, -diceSize/4);
          addDot(-diceSize/4, -diceSize/2 - 0.01, 0);
          addDot(-diceSize/4, -diceSize/2 - 0.01, diceSize/4);
          addDot(diceSize/4, -diceSize/2 - 0.01, -diceSize/4);
          addDot(diceSize/4, -diceSize/2 - 0.01, 0);
          addDot(diceSize/4, -diceSize/2 - 0.01, diceSize/4);
          break;
      }
      
      // Position dice at random horizontal positions across the entire visible width
      dice.position.set(
        (Math.random() * visibleWidth - (visibleWidth / 2)) * 0.9, // Full width distribution with small margin
        15 + Math.random() * 10, // Varied starting heights above the viewport
        Math.random() * 10 - 15 // Varied depth
      );
      
      dice.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Slower, gentler animation on mobile
      const speedFactor = isMobileView ? 0.5 : 1;
      
      // Randomized rotation velocity - slower on mobile
      const rotVel = {
        x: (Math.random() * 0.025 - 0.0125) * speedFactor, 
        y: (Math.random() * 0.025 - 0.0125) * speedFactor,
        z: (Math.random() * 0.025 - 0.0125) * speedFactor
      };
      
      // Randomized falling speed - slower on mobile
      const vel = {
        x: (Math.random() * 0.015 - 0.0075) * speedFactor, // Small horizontal drift
        y: (-Math.random() * 0.08 - 0.04) * speedFactor, // Varied falling speeds (slightly slower)
        z: (Math.random() * 0.015 - 0.0075) * speedFactor // Small z-axis drift
      };
      
      return { mesh: dice, rotVel, vel };
    };
    
    // Spawn dice with delay between each - fewer dice on mobile
    let diceCount = 0;
    const maxDice = isMobileView ? 15 : 30; // Reduced number on mobile
    
    // Initial set of dice (just a few to start)
    const initialDice = isMobileView ? 5 : 10;
    for (let i = 0; i < initialDice; i++) {
      const dice = createDice();
      scene.add(dice.mesh);
      diceObjects.push(dice);
      diceCount++;
    }
    
    // Create a spawn interval with longer delay on mobile
    const spawnDelay = isMobileView ? 500 : 300; // 500ms delay on mobile vs 300ms on desktop
    const spawnInterval = setInterval(() => {
      if (diceCount < maxDice) {
        const dice = createDice();
        scene.add(dice.mesh);
        diceObjects.push(dice);
        diceCount++;
      } else {
        clearInterval(spawnInterval);
      }
    }, spawnDelay); // Spawn a new dice at the appropriate interval
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      diceObjects.forEach(dice => {
        // Apply rotation
        dice.mesh.rotation.x += dice.rotVel.x;
        dice.mesh.rotation.y += dice.rotVel.y;
        dice.mesh.rotation.z += dice.rotVel.z;
        
        // Apply movement
        dice.mesh.position.x += dice.vel.x;
        dice.mesh.position.y += dice.vel.y;
        dice.mesh.position.z += dice.vel.z;
        
        // Reset position if dice goes out of view (bottom of screen)
        if (dice.mesh.position.y < -15) {
          // Reset to top of screen with new random x position
          dice.mesh.position.y = 15 + Math.random() * 5;
          dice.mesh.position.x = (Math.random() * visibleWidth - (visibleWidth / 2)) * 0.9;
          dice.mesh.position.z = Math.random() * 10 - 15;
          
          // Reset rotation with randomness
          dice.mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );
          
          // New random velocities for variation - adjusted for mobile
          const speedFactor = isMobileView ? 0.5 : 1;
          dice.vel.y = (-Math.random() * 0.08 - 0.04) * speedFactor; // Slower fall on mobile
          dice.vel.x = (Math.random() * 0.015 - 0.0075) * speedFactor;
          dice.vel.z = (Math.random() * 0.015 - 0.0075) * speedFactor;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Responsive handler
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Update camera and renderer
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      
      // Update visible width calculation
      const vFOV = THREE.MathUtils.degToRad(camera.fov);
      const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
      const newVisibleWidth = visibleHeight * camera.aspect;
      
      // Check if view changed between mobile and desktop
      const newIsMobileView = window.innerWidth < 768;
      
      // If the view type changed, adjust dice parameters
      if (newIsMobileView !== isMobileView) {
        // Update dice sizes and speeds
        const speedFactor = newIsMobileView ? 0.5 : 1;
        
        diceObjects.forEach(dice => {
          // Scale rotation and velocity based on device
          dice.rotVel.x *= speedFactor;
          dice.rotVel.y *= speedFactor;
          dice.rotVel.z *= speedFactor;
          dice.vel.x *= speedFactor;
          dice.vel.y *= speedFactor;
          dice.vel.z *= speedFactor;
          
          // Reset positions to be within the new visible width
          if (dice.mesh.position.y > 0) {
            dice.mesh.position.x = (Math.random() * newVisibleWidth - (newVisibleWidth / 2)) * 0.9;
          }
        });
      } else {
        // Just adjust positions for the new screen width
        diceObjects.forEach(dice => {
          if (dice.mesh.position.y > 0) {
            dice.mesh.position.x = (Math.random() * newVisibleWidth - (newVisibleWidth / 2)) * 0.9;
          }
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      clearInterval(spawnInterval);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js objects
      diceObjects.forEach(dice => {
        scene.remove(dice.mesh);
        (dice.mesh.geometry as THREE.BufferGeometry).dispose();
        (dice.mesh.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-gradient-to-br from-purple-700 to-purple-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjwvcmVjdD4KPC9zdmc+')] opacity-30"></div>
      <div ref={containerRef} className="absolute inset-0" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
        <div className="animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">
            Transform Images Into{isMobile ? ' ' : <br />}
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-sm">Dice Mosaics</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
            Create stunning artwork using nothing but dice. 
            Upload an image and transform it into a unique dice mosaic.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-10 justify-center">
            <Button 
              size={isMobile ? "default" : "lg"}
              onClick={handleGetStarted} 
              className="bg-white text-purple-800 hover:bg-yellow-100 rounded-full px-6 md:px-8 py-2 md:py-6 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Rocket className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Get Started
            </Button>
            <Button 
              size={isMobile ? "default" : "lg"}
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-6 md:px-8 py-2 md:py-6 font-medium shadow-lg transition-all duration-300"
            >
              <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Preset images section with responsive design */}
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl animate-fade-in px-2 sm:px-4" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-white text-base md:text-lg mb-3 md:mb-4 font-medium">Or select one of our preset images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            {presetImages.map((preset, index) => (
              <div 
                key={index}
                className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  selectedPreset === preset.url ? 'ring-4 ring-yellow-300' : ''
                }`}
                onClick={() => handlePresetSelect(preset.url)}
              >
                <div className="relative">
                  <img 
                    src={preset.thumbnail} 
                    alt={preset.name}
                    className="w-full h-20 sm:h-24 md:h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                </div>
                <div className="bg-black/80 p-2 md:p-3">
                  <p className="text-white text-xs sm:text-sm font-medium">{preset.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative elements - hide on smaller screens */}
      <div className="hidden md:block absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
      <div className="hidden md:block absolute -top-16 -right-16 w-64 h-64 bg-yellow-300 rounded-full filter blur-3xl opacity-10"></div>
    </div>
  );
};

export default HeroSection;
