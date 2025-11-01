import React from 'react';
import { Canvas } from '@react-three/fiber';

const Box: React.FC = () => {
  return (
    <mesh rotation={[0.4,0.6,0]}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color="#38bdf8" />
    </mesh>
  );
};

const ThreeTest: React.FC = () => {
  return (
    <div className="h-[60vh] w-full bg-black/60 rounded-md border">
      <Canvas camera={{ position: [2,2,3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10,10,10]} />
        <Box />
        {/* FBI 3D Test Component */}
      </Canvas>
    </div>
  );
};

export default ThreeTest;
