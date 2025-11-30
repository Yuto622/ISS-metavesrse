import { useEffect } from 'react';
import { useStore } from '../store';

export const useKeyboard = () => {
  const setInput = useStore((state) => state.setInput);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setInput({ moveForward: 1 }); break;
        case 'KeyS': setInput({ moveForward: -1 }); break;
        case 'KeyA': setInput({ rotateY: 1 }); break; // Rotate left
        case 'KeyD': setInput({ rotateY: -1 }); break; // Rotate right
        case 'Space': setInput({ ascend: 1 }); break;
        case 'ShiftLeft': setInput({ ascend: -1 }); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'KeyS': setInput({ moveForward: 0 }); break;
        case 'KeyA':
        case 'KeyD': setInput({ rotateY: 0 }); break;
        case 'Space':
        case 'ShiftLeft': setInput({ ascend: 0 }); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setInput]);
};
