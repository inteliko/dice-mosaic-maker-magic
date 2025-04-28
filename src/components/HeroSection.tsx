import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Dice creation function with slower movement
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
      
      // Much slower initial position spread
      dice.position.set(
        Math.random() * 16 - 8,  // Reduced spread
        Math.random() * 16 - 8,
        Math.random() * 8 - 16
      );
      
      dice.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Much slower rotation velocity
      const rotVel = {
        x: (Math.random() * 0.005 - 0.0025), // 4x slower
        y: (Math.random() * 0.005 - 0.0025),
        z: (Math.random() * 0.005 - 0.0025)
      };
      
      // Much slower movement velocity
      const vel = {
        x: (Math.random() * 0.008 - 0.004), // 4x slower
        y: (Math.random() * 0.008 - 0.004),
        z: Math.random() * 0.02 + 0.01 // Slower movement toward camera
      };
      
      return { mesh: dice, rotVel, vel };
    };
    
    // Create fewer dice for a cleaner look
    const diceObjects = Array.from({ length: 25 }, () => createDice());
    diceObjects.forEach(dice => scene.add(dice.mesh));
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      diceObjects.forEach(dice => {
        // Apply slower rotation
        dice.mesh.rotation.x += dice.rotVel.x;
        dice.mesh.rotation.y += dice.rotVel.y;
        dice.mesh.rotation.z += dice.rotVel.z;
        
        // Apply slower movement
        dice.mesh.position.x += dice.vel.x;
        dice.mesh.position.y += dice.vel.y;
        dice.mesh.position.z += dice.vel.z;
        
        // Reset position if dice goes out of view
        if (dice.mesh.position.z > 10) {
          dice.mesh.position.z = -20;
          dice.mesh.position.x = Math.random() * 16 - 8; // Reduced spread
          dice.mesh.position.y = Math.random() * 16 - 8;
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
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-white text-dice-primary hover:bg-yellow-100 rounded-full px-8 py-6">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8 py-6">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
