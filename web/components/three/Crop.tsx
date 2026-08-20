import React, { useMemo } from 'react';
import * as THREE from 'three';

// Generates lightweight geometry for a Wheat Plant stem + spikelet (wheat head)
export function createWheatGeometry() {
  const group = new THREE.Group();

  // 1. Stem (Tapered cylinder)
  const stemGeo = new THREE.CylinderGeometry(0.015, 0.03, 1.4, 6, 8);
  stemGeo.translate(0, 0.7, 0); // Origin at base for stem bending

  const stemMat = new THREE.MeshStandardMaterial({
    color: '#6b9e4a', // Fresh crop green
    roughness: 0.7,
    metalness: 0.1,
  });

  const stemMesh = new THREE.Mesh(stemGeo, stemMat);
  group.add(stemMesh);

  // 2. Wheat Spikelet / Head (Golden grain head at top)
  const headGeo = new THREE.ConeGeometry(0.06, 0.45, 6);
  headGeo.translate(0, 1.55, 0);

  const headMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b', // Golden wheat grain
    roughness: 0.5,
    metalness: 0.2,
  });

  const headMesh = new THREE.Mesh(headGeo, headMat);
  group.add(headMesh);

  // 3. Side Leaves
  const leafGeo = new THREE.ConeGeometry(0.02, 0.5, 4);
  leafGeo.rotateZ(Math.PI / 6);
  leafGeo.translate(-0.1, 0.6, 0);

  const leafMat = new THREE.MeshStandardMaterial({
    color: '#4a7c36',
    roughness: 0.8,
  });

  const leafMesh = new THREE.Mesh(leafGeo, leafMat);
  group.add(leafMesh);

  return group;
}

export function createWheatInstancedMesh(count: number) {
  // Create stem geometry
  const stemGeo = new THREE.CylinderGeometry(0.015, 0.03, 1.2, 5, 4);
  stemGeo.translate(0, 0.6, 0);

  // Create golden spikelet geometry at top
  const spikeGeo = new THREE.ConeGeometry(0.05, 0.4, 5);
  spikeGeo.translate(0, 1.3, 0);

  return { stemGeo, spikeGeo };
}
