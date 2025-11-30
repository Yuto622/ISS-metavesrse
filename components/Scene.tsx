import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { ISS } from './ISS';
import { Earth } from './Earth';
import { Player } from './Player';
import { Avatars } from './Avatars';

export const Scene: React.FC = () => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault fov={60} position={[0, 2, 10]} />
      
      {/* Space Environment */}
      <color attach="background" args={['#000000']} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Lighting */}
      {/* Sun Light (Strong directional) */}
      <directionalLight 
        position={[50, 20, 30]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]} 
        color="#fffaf0" 
      />
      {/* Earth Reflection (Blue fill from bottom) */}
      <spotLight position={[0, -20, 0]} intensity={1} color="#204060" distance={50} angle={Math.PI} />
      <ambientLight intensity={0.1} />

      {/* Objects */}
      <ISS />
      <Earth />
      <Avatars />
      <Player />
    </Canvas>
  );
};
