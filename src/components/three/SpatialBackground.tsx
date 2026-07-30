import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function hash(id: number) {
  let n = Math.sin(id * 127.1) * 43758.5453;
  return n - Math.floor(n);
}

function Particles({ count = 500 }) {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (hash(i * 3) - 0.5) * viewport.width * 2;
      positions[i3 + 1] = (hash(i * 3 + 1) - 0.5) * viewport.height * 2;
      positions[i3 + 2] = (hash(i * 3 + 2) - 0.5) * 10;

      velocities.push(
        (hash(i * 7 + 0) - 0.5) * 0.002,
        (hash(i * 7 + 1) - 0.5) * 0.002,
        (hash(i * 7 + 2) - 0.5) * 0.001
      );
    }

    return [positions, velocities];
  }, [count, viewport.width, viewport.height]);

  const velocitiesRef = useRef(velocities);
  velocitiesRef.current = velocities;

  useFrame(() => {
    if (!meshRef.current) return;

    const geo = meshRef.current.geometry as THREE.BufferGeometry;
    const positionsAttr = geo.attributes.position as THREE.BufferAttribute;
    const currentVelocities = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positionsAttr.array[i3] += currentVelocities[i3];
      positionsAttr.array[i3 + 1] += currentVelocities[i3 + 1];
      positionsAttr.array[i3 + 2] += currentVelocities[i3 + 2];

      if (Math.abs(positionsAttr.array[i3]) > viewport.width) currentVelocities[i3] *= -1;
      if (Math.abs(positionsAttr.array[i3 + 1]) > viewport.height) currentVelocities[i3 + 1] *= -1;
      if (Math.abs(positionsAttr.array[i3 + 2]) > 5) currentVelocities[i3 + 2] *= -1;
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00FF88"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function NetworkGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial color="#00FF88" transparent opacity={0.03} wireframe />
    </mesh>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const linePositions = useMemo(() => {
    const positions: number[] = [];
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < 20; i++) {
      const theta = hash(i * 4) * Math.PI * 2;
      const phi = Math.acos(2 * hash(i * 4 + 1) - 1);
      const r = 2 + hash(i * 4 + 2) * 0.5;
      nodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (hash(i * 13 + j) > 0.7) {
          positions.push(
            nodes[i].x,
            nodes[i].y,
            nodes[i].z,
            nodes[j].x,
            nodes[j].y,
            nodes[j].z
          );
        }
      }
    }

    return new Float32Array(positions);
  }, []);

  return (
    <lineSegments ref={linesRef} position={[0, 0, -5]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#00D9FF" transparent opacity={0.15} />
    </lineSegments>
  );
}

export function SpatialBackground() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Particles count={300} />
      <NetworkGlobe />
      <ConnectionLines />
    </>
  );
}
