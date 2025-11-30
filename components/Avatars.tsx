import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const NAMES = ['User101', 'Astro_J', 'Cosmo-9', 'SPEAKER-2', 'Voyager', 'Cmdr_Shepard', 'Major_Tom', 'StarWalker'];

interface AstronautNPCProps {
    position: [number, number, number];
    name: string;
    isFuturistic: boolean;
}

const AstronautNPC: React.FC<AstronautNPCProps> = ({ position, name, isFuturistic }) => {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(groupRef.current) {
            // Slowly rotate to face center or drift
            groupRef.current.rotation.y += 0.002;
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={groupRef} position={position}>
                 {/* Name Tag */}
                 <Text
                    position={[0, 1.2, 0]}
                    fontSize={0.15}
                    color={isFuturistic ? "#00ff00" : "white"}
                    anchorX="center"
                    anchorY="middle"
                    billboard
                >
                    {name}
                </Text>

                {/* Simplified Body */}
                 <mesh position={[0, 0, 0]}>
                    <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
                    <meshStandardMaterial color={isFuturistic ? "#333" : "white"} />
                </mesh>
                
                {/* Head */}
                <mesh position={[0, 0.7, 0]}>
                    <boxGeometry args={[0.4, 0.4, 0.4]} />
                    {isFuturistic ? (
                         <meshBasicMaterial color="black" />
                    ) : (
                        <meshStandardMaterial color="white" />
                    )}
                </mesh>

                {/* Face/Visor */}
                 <mesh position={[0, 0.7, 0.21]}>
                    <planeGeometry args={[0.35, 0.3]} />
                    {isFuturistic ? (
                         <meshBasicMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={1} />
                    ) : (
                        <meshStandardMaterial color="gold" metalness={1} roughness={0} />
                    )}
                </mesh>
            </group>
        </Float>
    )
}

export const Avatars: React.FC = () => {
    const avatars = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const radius = 10 + Math.random() * 5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 8;
            const isFuturistic = Math.random() > 0.7;
            
            temp.push({
                id: i,
                position: [x, y, z] as [number, number, number],
                name: NAMES[i % NAMES.length] + (Math.floor(Math.random() * 99)),
                isFuturistic
            });
        }
        return temp;
    }, []);

    return (
        <group>
            {avatars.map(av => (
                <AstronautNPC key={av.id} position={av.position} name={av.name} isFuturistic={av.isFuturistic} />
            ))}
        </group>
    );
};