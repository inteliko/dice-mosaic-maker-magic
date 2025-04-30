
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

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
    scene.background = new THREE.Color(0x6854b3); // Matches dice-primary color

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 20;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Calculate the visible width at camera z-position for full width distribution
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
    const visibleWidth = visibleHeight * camera.aspect;

    // Dice creation function with wider distribution
    const createDice = () => {
      const diceSize = 2;
      const geometry = new THREE.BoxGeometry(diceSize, diceSize, diceSize);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1,
      });
      
      const dice = new THREE.Mesh(geometry, material);
      
      // Add dice dots (all faces)
      const addDot = (x: number, y: number, z: number) => {
        const dotGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const dotMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
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
      
      // Randomized rotation velocity for more natural movement
      const rotVel = {
        x: (Math.random() * 0.03 - 0.015), 
        y: (Math.random() * 0.03 - 0.015),
        z: (Math.random() * 0.03 - 0.015)
      };
      
      // Randomized falling speed
      const vel = {
        x: (Math.random() * 0.02 - 0.01), // Small horizontal drift
        y: -Math.random() * 0.1 - 0.05, // Varied falling speeds
        z: Math.random() * 0.02 - 0.01 // Small z-axis drift
      };
      
      return { mesh: dice, rotVel, vel };
    };
    
    // Create more dice for a fuller effect
    const diceObjects = Array.from({ length: 50 }, () => createDice());
    diceObjects.forEach(dice => scene.add(dice.mesh));
    
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
          
          // New random velocities for variation
          dice.vel.y = -Math.random() * 0.1 - 0.05;
          dice.vel.x = (Math.random() * 0.02 - 0.01);
          dice.vel.z = Math.random() * 0.02 - 0.01;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      
      // Update visible width calculation
      const vFOV = THREE.MathUtils.degToRad(camera.fov);
      const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
      const newVisibleWidth = visibleHeight * camera.aspect;
      
      // Reset dice positions to be within the new visible width
      diceObjects.forEach(dice => {
        if (dice.mesh.position.y > 0) { // Only adjust dice that are above the center
          dice.mesh.position.x = (Math.random() * newVisibleWidth - (newVisibleWidth / 2)) * 0.9;
        }
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-gradient-to-br from-dice-primary to-dice-secondary">
      <div ref={containerRef} className="absolute inset-0" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Turn Images Into <br />
          <span className="text-yellow-200">Dice Mosaics</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8">
          Create stunning artwork using nothing but dice. 
          Upload an image and transform it into a unique dice mosaic.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button size="lg" onClick={handleGetStarted} className="bg-white text-dice-primary hover:bg-yellow-100 rounded-full px-8 py-6">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8 py-6">
            Learn More
          </Button>
        </div>
        
        {/* Preset images section */}
        <div className="w-full max-w-3xl">
          <h3 className="text-white text-lg mb-4">Or select one of our preset images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {presetImages.map((preset, index) => (
              <div 
                key={index}
                className={`rounded-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                  selectedPreset === preset.url ? 'ring-4 ring-yellow-300' : ''
                }`}
                onClick={() => handlePresetSelect(preset.url)}
              >
                <img 
                  src={preset.thumbnail} 
                  alt={preset.name}
                  className="w-full h-32 object-cover"
                />
                <div className="bg-black/70 p-2">
                  <p className="text-white text-sm">{preset.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
