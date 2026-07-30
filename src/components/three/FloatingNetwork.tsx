"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface FloatingNodeProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  speed?: number;
}

export function FloatingNode({
  position,
  size = 0.08,
  color = "#00FF88",
  speed = 0.5,
}: FloatingNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        initialY + Math.sin(state.clock.getElapsedTime() * speed) * 0.3;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}
