import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useAccessibility } from '../hooks/useAccessibility.jsx';

const NODES = [
  { position: [-1.6, 0.8, 0], color: '#2e9b70', label: 'Education' },
  { position: [1.6, 1.1, -0.4], color: '#3b82f6', label: 'Jobs' },
  { position: [-1.4, -1.0, 0.3], color: '#f59e0b', label: 'Skills' },
  { position: [1.5, -0.9, 0.2], color: '#a855f7', label: 'Government' },
  { position: [0, 1.9, -0.2], color: '#ef4444', label: 'Financial' },
  { position: [0, -1.9, 0.1], color: '#14b8a6', label: 'AI' },
];

function Node({ position, color, speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * speed + position[0]) * 0.15;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.2;
  });
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
    </mesh>
  );
}

function CenterCore() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.4;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial color="#1f7d5a" roughness={0.25} metalness={0.2} emissive="#1f7d5a" emissiveIntensity={0.15} />
    </mesh>
  );
}

function Lines() {
  return NODES.map((n, i) => {
    const points = [
      [0, 0, 0],
      n.position,
    ];
    return <Line key={i} points={points} color={n.color} />;
  });
}

function Line({ points, color }) {
  const ref = useRef();
  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.35} />
    </line>
  );
}

export default function HeroScene() {
  const { settings } = useAccessibility();

  if (settings.reduceMotion) {
    return (
      <div
        role="img"
        aria-label="Illustration of interconnected opportunity categories: education, jobs, skills, government schemes, financial support and AI"
        className="flex h-72 w-full items-center justify-center sm:h-96"
      >
        <div className="grid grid-cols-3 gap-4 opacity-80">
          {['Education', 'Jobs', 'Skills', 'Government', 'Financial', 'AI'].map((label) => (
            <div key={label} className="glass rounded-2xl px-4 py-6 text-center text-sm font-semibold text-uplift-800">
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label="Animated 3D illustration of interconnected opportunity categories: education, jobs, skills, government schemes, financial support and AI"
      className="h-72 w-full sm:h-96"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <group>
            <CenterCore />
            <Lines />
            {NODES.map((n, i) => (
              <Node key={i} position={n.position} color={n.color} speed={0.6 + i * 0.1} />
            ))}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
