import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.005; // Slow rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.007; // Clouds move slightly faster
    }
  });

  return (
    <group position={[0, -108, 0]}>
      {/* Atmosphere Glow (Rim) - Simplified via scaling mesh inside-out or shader. 
          For simple declarative code, we use a slightly larger sphere with backface culling. */}
      
      {/* Main Earth Sphere */}
      <mesh ref={earthRef} rotation={[0, 0, 23.5 * Math.PI / 180]}>
        <sphereGeometry args={[100, 64, 64]} />
        <meshStandardMaterial 
            color="#1E3F5A" // Deep ocean blue base
            emissive="#001133"
            emissiveIntensity={0.1}
            roughness={0.8}
            metalness={0.1}
        />
      </mesh>

      {/* Fake Clouds/Atmosphere Layer */}
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[100, 64, 64]} />
        <meshPhongMaterial 
            color="#ffffff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
        />
      </mesh>
    </group>
  );
};
