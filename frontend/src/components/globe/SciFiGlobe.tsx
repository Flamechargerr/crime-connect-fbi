import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export interface Marker { lat: number; lon: number; color?: string; size?: number }

// Convert lat/lon to 3D position on a sphere of given radius
function latLonToVector3(lat: number, lon: number, radius: number){
  const phi = (90 - lat) * (Math.PI/180);
  const theta = (lon + 180) * (Math.PI/180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x,y,z] as [number, number, number];
}

const GlobeMesh: React.FC<{ markers: Marker[] }>=({ markers })=>{
  const radius = 1.8;
  const points = useMemo(()=> markers.map(m=>({...m, pos: latLonToVector3(m.lat, m.lon, radius+0.01)})),[markers]);
  return (
    <group>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#0a1523" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Grid overlay */}
      <mesh>
        <sphereGeometry args={[radius+0.002, 64, 64]} />
        <meshBasicMaterial color="#38bdf8" wireframe opacity={0.25} transparent />
      </mesh>
      {/* Radar sweep plane */}
      <mesh rotation={[Math.PI/2,0,0]}>
        <circleGeometry args={[radius*1.05, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} />
      </mesh>
      {/* Markers */}
      {points.map((p,i)=> (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[0.035*(p.size||1), 16, 16]} />
          <meshStandardMaterial color={p.color||'#f43f5e'} emissive={p.color||'#f43f5e'} emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

const SciFiGlobe: React.FC<{ markers: Marker[] }>=({ markers })=>{
  return (
    <div className="h-[65vh] w-full bg-black/60 rounded-md border relative">
      <Canvas camera={{ position: [0,0,5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5,5,5]} intensity={0.6} />
        <Stars radius={50} depth={20} count={2000} factor={4} saturation={0} fade speed={0.6} />
        <GlobeMesh markers={markers} />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
      {/* HUD overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]" />
        <div className="absolute inset-6 border border-cyan-500/30 rounded-md" />
        <div className="absolute left-4 top-4 text-xs text-cyan-300/80">GLOBAL TRACKING GRID</div>
      </div>
    </div>
  );
};

export default SciFiGlobe;
