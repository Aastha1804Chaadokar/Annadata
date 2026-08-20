'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import '@react-three/fiber';
import * as THREE from 'three';

interface CropFieldProps {
  count?: number;
  reducedMotion?: boolean;
}

export const CropField: React.FC<CropFieldProps> = ({
  count = 350,
  reducedMotion = false,
}) => {
  const stemRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);

  // Generate plant instance transformations and wind attributes
  const instanceData = useMemo(() => {
    const data = [];
    const width = 24;
    const depth = 16;

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * width;
      const z = -Math.random() * depth + 2;
      const y = 0;

      const scaleY = 0.85 + Math.random() * 0.4;
      const scaleXZ = 0.8 + Math.random() * 0.4;
      const baseRotationY = Math.random() * Math.PI * 2;

      const windOffset = Math.random() * Math.PI * 2;
      const windSpeed = 0.8 + Math.random() * 0.7;
      const windStrength = 0.08 + Math.random() * 0.06;

      data.push({
        x,
        y,
        z,
        scaleY,
        scaleXZ,
        baseRotationY,
        windOffset,
        windSpeed,
        windStrength,
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize static instance matrices
  useEffect(() => {
    if (!stemRef.current || !headRef.current) return;

    instanceData.forEach((data, i) => {
      dummy.position.set(data.x, data.y, data.z);
      dummy.scale.set(data.scaleXZ, data.scaleY, data.scaleXZ);
      dummy.rotation.set(0, data.baseRotationY, 0);
      dummy.updateMatrix();

      stemRef.current?.setMatrixAt(i, dummy.matrix);
      headRef.current?.setMatrixAt(i, dummy.matrix);
    });

    stemRef.current.instanceMatrix.needsUpdate = true;
    headRef.current.instanceMatrix.needsUpdate = true;
  }, [instanceData, dummy]);

  // Frame loop for dynamic stem bending in the wind
  useFrame(({ clock }) => {
    if (reducedMotion || !stemRef.current || !headRef.current) return;

    const time = clock.getElapsedTime();

    instanceData.forEach((data, i) => {
      const windAngleX =
        Math.sin(time * data.windSpeed + data.windOffset) * data.windStrength;
      const windAngleZ =
        Math.cos(time * data.windSpeed * 0.7 + data.windOffset) * (data.windStrength * 0.5);

      dummy.position.set(data.x, data.y, data.z);
      dummy.scale.set(data.scaleXZ, data.scaleY, data.scaleXZ);
      dummy.rotation.set(windAngleX, data.baseRotationY, windAngleZ);
      dummy.updateMatrix();

      stemRef.current?.setMatrixAt(i, dummy.matrix);
      headRef.current?.setMatrixAt(i, dummy.matrix);
    });

    stemRef.current.instanceMatrix.needsUpdate = true;
    headRef.current.instanceMatrix.needsUpdate = true;
  });

  const stemGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.012, 0.028, 1.2, 5, 4);
    geo.translate(0, 0.6, 0);
    return geo;
  }, []);

  const headGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.05, 0.45, 5);
    geo.translate(0, 1.35, 0);
    return geo;
  }, []);

  return (
    <group>
      {/* Wheat Stems - Natural Agricultural Green */}
      <instancedMesh
        ref={stemRef as any}
        args={[stemGeo as any, undefined, count]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#3F7D3A"
          roughness={0.6}
          metalness={0.1}
        />
      </instancedMesh>

      {/* Wheat Heads - Warm Golden Grain */}
      <instancedMesh
        ref={headRef as any}
        args={[headGeo as any, undefined, count]}
        castShadow
      >
        <meshStandardMaterial
          color="#E8B94A"
          roughness={0.4}
          metalness={0.2}
          emissive="#D8A93E"
          emissiveIntensity={0.15}
        />
      </instancedMesh>
    </group>
  );
};
