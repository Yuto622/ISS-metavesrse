import React, { Suspense } from 'react';
import { Scene } from './components/Scene';
import { HUD } from './components/HUD';
import { useKeyboard } from './hooks/useKeyboard';
import { Loader } from '@react-three/drei';

const App: React.FC = () => {
  useKeyboard();

  return (
    <div className="relative w-full h-screen bg-black">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <HUD />
      <Loader />
    </div>
  );
};

export default App;
