import React, { useMemo, useState, useRef } from 'react';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

export interface Marker { lat: number; lon: number; color?: string; size?: number; id?: string; label?: string }

// Convert lat/lon to 3D position on a sphere of given radius
function latLonToVector3(lat: number, lon: number, radius: number){
  const phi = (90 - lat) * (Math.PI/180);
  const theta = (lon + 180) * (Math.PI/180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Arc({ a, b, color = '#a78bfa' }: { a: THREE.Vector3, b: THREE.Vector3, color?: string }){
  // Elevated arc using a quadratic Bezier curve
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(a.length() * 1.15);
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  const points = curve.getPoints(64);
  return <Line points={points} color={color} lineWidth={2} dashed dashSize={0.2} gapSize={0.1} />
}

const GlobeMesh: React.FC<{ markers: Marker[], onSelect?: (m: Marker) => void }>=({ markers, onSelect })=>{
  const radius = 1.8;
  const points = useMemo(()=> markers.map(m=>({ ...m, pos: latLonToVector3(m.lat, m.lon, radius+0.01) })),[markers]);
  const [hover, setHover] = useState<string|null>(null);

  useFrame(({ gl }) => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); });

  return (
    <group>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#0a1523" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Grid overlay */}
      <mesh>
        <sphereGeometry args={[radius+0.0015, 64, 64]} />
        <meshBasicMaterial color="#38bdf8" wireframe opacity={0.25} transparent />
      </mesh>

      {/* Great-circle arcs between points (pairs) */}
      {points.length > 1 && points.slice(1).map((p,i)=> (
        <Arc key={i} a={points[0].pos} b={p.pos} color="#22d3ee" />
      ))}

      {/* Markers */}
      {points.map((p,i)=> (
        <group key={p.id||i} position={p.pos}>
          <mesh
            onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(p.id || String(i)); }}
            onPointerOut={() => setHover(h => (h === (p.id||String(i)) ? null : h))}
            onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect?.(p); }}
          >
            <sphereGeometry args={[0.04*(p.size||1), 16, 16]} />
            <meshStandardMaterial color={p.color||'#f43f5e'} emissive={p.color||'#f43f5e'} emissiveIntensity={0.9} />
          </mesh>
          {/* halo */}
          {hover === (p.id||String(i)) && (
            <mesh>
              <ringGeometry args={[0.06, 0.08, 32]} />
              <meshBasicMaterial color={p.color||'#f43f5e'} transparent opacity={0.9} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

const SciFiGlobe: React.FC<{ markers: Marker[], onSelect?: (m: Marker) => void }>=({ markers, onSelect })=>{
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  return (
    <div className="h-[65vh] w-full bg-black/60 rounded-md border relative">
      <Canvas camera={{ position: [0,0,5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5,5,5]} intensity={0.6} />
        <Stars radius={50} depth={20} count={1800} factor={4} saturation={0} fade speed={0.4} />
        <GlobeMesh markers={markers} onSelect={onSelect} />
        <OrbitControls ref={controlsRef} enablePan={false} autoRotate={autoRotate} autoRotateSpeed={0.6} />
      </Canvas>
      {/* HUD overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]" />
        <div className="absolute inset-6 border border-cyan-500/30 rounded-md" />
        <div className="absolute left-4 top-4 text-xs text-cyan-300/80">GLOBAL TRACKING GRID</div>
      </div>
      {/* Controls */}
      <div className="absolute right-4 bottom-4 flex gap-2 pointer-events-auto">
        <button className="px-3 py-1.5 text-xs rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 hover:bg-cyan-500/30" onClick={()=>setAutoRotate(r=>!r)}>{autoRotate? 'Pause' : 'Rotate'}</button>
        <button className="px-3 py-1.5 text-xs rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40" onClick={()=>{ controlsRef.current?.zoomIn?.(); controlsRef.current?.update?.(); }}>+</button>
        <button className="px-3 py-1.5 text-xs rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40" onClick={()=>{ controlsRef.current?.zoomOut?.(); controlsRef.current?.update?.(); }}>-</button>
      </div>
    </div>
  );
};

export default SciFiGlobe;
