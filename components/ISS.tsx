import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { ModuleInfo } from '../types';

// Module Definitions
export const MODULES: ModuleInfo[] = [
  {
    id: 'kibo',
    name: 'KIBO / JEM',
    descriptionJa: '日本が開発したISS最大の実験棟。船外実験プラットフォームを持つ。',
    descriptionEn: "Japan's science module for microgravity experiments. Largest single module.",
    position: [0, 1.5, 4], 
  },
  {
    id: 'columbus',
    name: 'Columbus',
    descriptionJa: '欧州宇宙機関(ESA)の科学実験施設。',
    descriptionEn: "European Space Agency's science laboratory.",
    position: [0, 1.5, -4],
  },
  {
    id: 'destiny',
    name: 'Destiny',
    descriptionJa: 'NASAの実験棟。ISSのシステム制御の中枢でもある。',
    descriptionEn: "NASA's primary research laboratory and control center.",
    position: [0, 1.5, 0],
  },
  {
    id: 'harmony',
    name: 'Harmony',
    descriptionJa: '各国の実験棟をつなぐ結合ノード。',
    descriptionEn: "Utility hub connecting the laboratory modules.",
    position: [4, 1.5, 0],
  },
  {
    id: 'zarya',
    name: 'Zarya',
    descriptionJa: 'ISSの最初のモジュール。電力と推進力を提供。',
    descriptionEn: "The first module of the ISS. Provided power and propulsion.",
    position: [-5, 1.5, 0],
  }
];

// Reusable Materials
const metallicMat = new THREE.MeshStandardMaterial({ color: '#cccccc', roughness: 0.3, metalness: 0.8 });
const solarMat = new THREE.MeshStandardMaterial({ color: '#1a2b4c', roughness: 0.2, metalness: 0.5, emissive: '#0a1a3c', emissiveIntensity: 0.2 });
const goldFoilMat = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.6, metalness: 0.6 });
const whitePaintMat = new THREE.MeshStandardMaterial({ color: '#eeeeee', roughness: 0.5 });

const SolarArray = ({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : new THREE.Euler(0, 0, 0)}>
    <mesh material={solarMat}>
      <boxGeometry args={[2, 0.1, 12]} />
    </mesh>
    {/* Connector */}
    <mesh position={[0, 0, 0]} material={metallicMat}>
      <cylinderGeometry args={[0.2, 0.2, 12.2]} />
    </mesh>
  </group>
);

export const ISS: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const playerRef = useStore((state) => state.playerRef);
  const setActiveModule = useStore((state) => state.setActiveModule);
  const activeModule = useStore((state) => state.activeModule);

  useFrame(() => {
    if (!playerRef?.current || !groupRef.current) return;
    
    // Simple proximity check
    const playerPos = playerRef.current.position;
    let closest: ModuleInfo | null = null;
    let minDist = 8.0; // Activation distance

    MODULES.forEach((mod) => {
      // Adjust mod position relative to group if group moves (it doesn't here, but good practice)
      const modPos = new THREE.Vector3(...mod.position);
      const dist = playerPos.distanceTo(modPos);
      if (dist < minDist) {
        minDist = dist;
        closest = mod;
      }
    });

    if (closest?.id !== activeModule?.id) {
      setActiveModule(closest);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* --- Main Truss Structure --- */}
      <mesh position={[0, 0, 0]} material={metallicMat}>
        <boxGeometry args={[40, 1, 1]} />
      </mesh>
      
      {/* --- Solar Arrays (Left & Right) --- */}
      <group position={[-18, 0, 0]}>
         <SolarArray position={[0, 0, 6]} rotation={[Math.PI/4, 0, 0]} />
         <SolarArray position={[0, 0, -6]} rotation={[Math.PI/4, 0, 0]} />
      </group>
      <group position={[18, 0, 0]}>
         <SolarArray position={[0, 0, 6]} rotation={[Math.PI/4, 0, 0]} />
         <SolarArray position={[0, 0, -6]} rotation={[Math.PI/4, 0, 0]} />
      </group>

      {/* --- Central Modules --- */}
      
      {/* Destiny (Center) */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} material={whitePaintMat}>
        <cylinderGeometry args={[1.5, 1.5, 6, 16]} />
      </mesh>

      {/* Harmony (Forward Node) */}
      <mesh position={[4, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} material={whitePaintMat}>
        <cylinderGeometry args={[1.6, 1.6, 3, 16]} />
      </mesh>

      {/* Zarya/Zvezda (Rear) */}
      <mesh position={[-5, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} material={whitePaintMat}>
        <cylinderGeometry args={[1.4, 1.4, 6, 16]} />
      </mesh>

      {/* Kibo (Side) */}
      <group position={[4, 1.5, 4]}>
        <mesh rotation={[Math.PI/2, 0, 0]} material={whitePaintMat}>
           <cylinderGeometry args={[1.8, 1.8, 6, 16]} />
        </mesh>
        {/* Kibo Porch */}
        <mesh position={[0, 0, 4]} material={metallicMat}>
            <boxGeometry args={[3, 1, 3]} />
        </mesh>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.8}
          color={activeModule?.id === 'kibo' ? '#00ffaa' : 'white'}
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI, 0]} // Face outward roughly
        >
          KIBO
        </Text>
      </group>

      {/* Columbus (Other Side) */}
      <group position={[4, 1.5, -3.5]}>
         <mesh rotation={[Math.PI/2, 0, 0]} material={whitePaintMat}>
           <cylinderGeometry args={[1.7, 1.7, 5, 16]} />
        </mesh>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.8}
          color={activeModule?.id === 'columbus' ? '#00ffaa' : 'white'}
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, 0]} 
        >
          COLUMBUS
        </Text>
      </group>

       {/* Radiators (Zigzag) */}
       <mesh position={[-6, 4, -4]} rotation={[0.2, 0, 0]} material={whitePaintMat}>
         <boxGeometry args={[4, 8, 0.2]} />
       </mesh>
       <mesh position={[-6, 4, 4]} rotation={[-0.2, 0, 0]} material={whitePaintMat}>
         <boxGeometry args={[4, 8, 0.2]} />
       </mesh>

      {/* Interactive Highlights */}
      {MODULES.map((mod) => (
        <mesh key={mod.id} position={mod.position} visible={activeModule?.id === mod.id}>
           <sphereGeometry args={[2.5, 16, 16]} />
           <meshBasicMaterial color="#00ffaa" wireframe transparent opacity={0.15} />
        </mesh>
      ))}

    </group>
  );
};
