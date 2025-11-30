import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';

const PLAYER_SPEED = 5.0;
const ROTATION_SPEED = 2.0;
const LERP_FACTOR = 0.1;

export const Player: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const avatarBodyRef = useRef<THREE.Group>(null);
  
  const { camera } = useThree();
  const input = useStore((state) => state.input);
  const cameraMode = useStore((state) => state.cameraMode);
  const setPlayerRef = useStore((state) => state.setPlayerRef);

  // Initial random position slightly away from station
  const position = useRef(new THREE.Vector3(0, 5, 20));
  const rotation = useRef(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    setPlayerRef(groupRef);
  }, [setPlayerRef]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // --- Movement Physics (Simplified) ---
    // Create movement vector based on input
    const moveVec = new THREE.Vector3(input.moveRight, input.ascend, -input.moveForward);
    moveVec.applyEuler(rotation.current); // Move relative to player facing
    moveVec.multiplyScalar(PLAYER_SPEED * delta);

    position.current.add(moveVec);

    // --- Rotation Physics ---
    // Y-axis rotation (Yaw)
    rotation.current.y -= input.rotateY * ROTATION_SPEED * delta;
    
    // Apply transforms
    groupRef.current.position.lerp(position.current, LERP_FACTOR * 5); // Smooth position
    groupRef.current.rotation.copy(rotation.current);

    // --- Camera Follow Logic ---
    const targetPos = groupRef.current.position.clone();
    const targetRot = groupRef.current.rotation.clone();

    if (cameraMode === 'FIRST_PERSON') {
      // Camera inside the head
      const camOffset = new THREE.Vector3(0, 0.2, 0.2); // Slightly forward/up
      camOffset.applyEuler(targetRot);
      camera.position.lerp(targetPos.add(camOffset), LERP_FACTOR);
      camera.quaternion.slerp(groupRef.current.quaternion, LERP_FACTOR);
    } else {
      // Third person chase cam
      const camOffset = new THREE.Vector3(0, 2, 6); // Behind and up
      camOffset.applyEuler(targetRot);
      const camPos = targetPos.clone().add(camOffset);
      
      camera.position.lerp(camPos, LERP_FACTOR);
      camera.lookAt(groupRef.current.position);
    }
    
    // Slight floating animation for the avatar mesh itself (breathing)
    if (avatarBodyRef.current) {
        avatarBodyRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
        avatarBodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Only render avatar body in 3rd person to avoid clipping */}
      <group ref={avatarBodyRef} visible={cameraMode === 'THIRD_PERSON'}>
        {/* Astronaut Model (Procedural) */}
        {/* Backpack */}
        <mesh position={[0, 0, -0.25]} castShadow>
            <boxGeometry args={[0.5, 0.7, 0.3]} />
            <meshStandardMaterial color="white" />
        </mesh>
        {/* Body */}
        <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.25, 0.6, 4, 8]} />
            <meshStandardMaterial color="white" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="white" roughness={0.2} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 0.35, 0.15]}>
            <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="gold" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};
