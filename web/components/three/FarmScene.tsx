'use client';

import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { CropField } from './CropField';
import { Fallback2DFarm } from './Fallback2DFarm';

// Camera movement controller
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    if (reducedMotion) {
      state.camera.position.set(0, 2.2, 5);
      state.camera.lookAt(0, 1.2, -4);
      return;
    }

    const time = state.clock.getElapsedTime();
    const targetZ = 5.5 - Math.min(scrollY * 0.003, 3) + Math.sin(time * 0.2) * 0.15;
    const targetY = 2.4 - Math.min(scrollY * 0.001, 0.8) + Math.cos(time * 0.15) * 0.08;

    state.camera.position.lerp(new THREE.Vector3(0, targetY, targetZ), 0.05);
    state.camera.lookAt(0, 0.8, -4);
  });

  return null;
}

export const FarmScene: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!hasWebGL) {
    return <Fallback2DFarm />;
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 2.5, 6], fov: 45 }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        {/* Bright Morning Agricultural Sun & Ambient Lighting */}
        <ambientLight intensity={1.2} color="#FFF8E8" />
        <directionalLight
          position={[12, 18, 10]}
          intensity={2.2}
          color="#E8B94A"
          castShadow={!isMobile}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-12, 10, -10]}
          intensity={0.8}
          color="#DCEFF5"
        />

        {/* Light Morning Mist Fog */}
        <fog attach="fog" args={['#F8FAF3', 10, 28]} />

        {/* Bright Morning Sky */}
        <Sky
          distance={450000}
          sunPosition={[12, 18, 10]}
          inclination={0.4}
          azimuth={0.2}
          turbidity={4}
          rayleigh={1.2}
        />

        {/* Soil Plane - Natural Earth Brown */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -5]} receiveShadow>
          <planeGeometry args={[40, 30]} />
          <meshStandardMaterial
            color="#9A7048"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* Wheat Field */}
        <CropField
          count={isMobile ? 140 : 400}
          reducedMotion={reducedMotion}
        />

        {/* Camera rig controller */}
        <CameraRig reducedMotion={reducedMotion} />
      </Canvas>

      {/* Light gradient overlay to blend into #F8FAF3 hero background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAF3] via-[#F8FAF3]/30 to-transparent" />
    </div>
  );
};
