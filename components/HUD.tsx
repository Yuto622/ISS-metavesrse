import React, { useState } from 'react';
import { useStore } from '../store';
import { Maximize2, Monitor, Globe, Info, Zap, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, User } from 'lucide-react';

const playSound = (freq = 440) => {
  try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
      // Ignore audio errors
  }
};

export const HUD: React.FC = () => {
  const activeModule = useStore((state) => state.activeModule);
  const cameraMode = useStore((state) => state.cameraMode);
  const toggleCameraMode = useStore((state) => state.toggleCameraMode);
  const setInput = useStore((state) => state.setInput);

  const [expanded, setExpanded] = useState(false);

  const handleTouchStart = (action: string) => {
    playSound(600);
    switch (action) {
        case 'F': setInput({ moveForward: 1 }); break;
        case 'B': setInput({ moveForward: -1 }); break;
        case 'L': setInput({ rotateY: 1 }); break;
        case 'R': setInput({ rotateY: -1 }); break;
        case 'U': setInput({ ascend: 1 }); break;
        case 'D': setInput({ ascend: -1 }); break;
    }
  };

  const handleTouchEnd = () => {
      setInput({ moveForward: 0, rotateY: 0, ascend: 0 });
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="text-white font-bold text-xl tracking-widest uppercase border-l-4 border-green-400 pl-3">
            ISS Metaverse
          </h1>
          <div className="text-xs text-green-400 pl-3 flex items-center gap-1 mt-1 font-mono">
            <Globe size={12} /> ORBITAL STATUS: STABLE
          </div>
        </div>
        
        <button 
          onClick={() => { toggleCameraMode(); playSound(800); }}
          className="bg-gray-800/60 backdrop-blur border border-white/20 p-2 rounded-full hover:bg-white/10 active:scale-95 transition"
        >
            {cameraMode === 'FIRST_PERSON' ? <Monitor className="text-green-400" /> : <User className="text-green-400" />}
        </button>
      </div>

      {/* Info Panel (Bottom Center) - Only shows when activeModule is set */}
      {activeModule && (
        <div className={`absolute bottom-32 md:bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] transition-all duration-500 ease-out transform pointer-events-auto
            ${expanded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-100'}`}>
          <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-[0_0_30px_rgba(0,255,100,0.1)] relative overflow-hidden group">
            
            {/* Decorative Lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-green-500/20 skew-x-12"></div>

            <div className="flex justify-between items-start mb-2">
                <div>
                     <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">{activeModule.name}</h2>
                     <div className="text-green-400 text-xs font-mono mb-2 flex items-center gap-2">
                        <Zap size={12} /> SYSTEM ONLINE
                     </div>
                </div>
                <div className="bg-white/10 px-2 py-1 rounded text-xs text-white/70 font-mono">
                    ID: {activeModule.id.toUpperCase()}
                </div>
            </div>
            
            <p className="text-white/90 text-sm mb-1 leading-relaxed">{activeModule.descriptionJa}</p>
            <p className="text-white/50 text-xs italic leading-relaxed border-t border-white/10 pt-2 mt-2">{activeModule.descriptionEn}</p>
            
            <button 
                className="mt-4 w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-bold py-2 rounded border border-green-500/30 uppercase tracking-widest transition"
                onClick={() => {
                    console.log(`open:${activeModule.id}`);
                    playSound(1000);
                }}
            >
                View Detailed Analytics
            </button>
          </div>
        </div>
      )}

      {/* Mobile Controls (Bottom Corners) */}
      <div className="absolute bottom-6 left-6 grid grid-cols-3 gap-2 pointer-events-auto md:hidden">
         <div />
         <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 active:bg-green-500/40"
            onTouchStart={() => handleTouchStart('F')} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart('F')} onMouseUp={handleTouchEnd}>
             <ChevronUp className="text-white" />
         </button>
         <div />
         <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 active:bg-green-500/40"
            onTouchStart={() => handleTouchStart('L')} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart('L')} onMouseUp={handleTouchEnd}>
             <ChevronLeft className="text-white" />
         </button>
         <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 active:bg-green-500/40"
            onTouchStart={() => handleTouchStart('B')} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart('B')} onMouseUp={handleTouchEnd}>
             <ChevronDown className="text-white" />
         </button>
         <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 active:bg-green-500/40"
             onTouchStart={() => handleTouchStart('R')} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart('R')} onMouseUp={handleTouchEnd}>
             <ChevronRight className="text-white" />
         </button>
      </div>

       <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-auto md:hidden">
         <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 active:bg-green-500/40"
            onTouchStart={() => handleTouchStart('U')} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart('U')} onMouseUp={handleTouchEnd}>
             <span className="text-white font-bold text-xs">UP</span>
         </button>
         <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 active:bg-green-500/40"
            onTouchStart={() => handleTouchStart('D')} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart('D')} onMouseUp={handleTouchEnd}>
             <span className="text-white font-bold text-xs">DWN</span>
         </button>
      </div>

      {/* PC Instructions */}
      <div className="hidden md:block absolute bottom-6 right-6 text-right text-white/40 font-mono text-xs pointer-events-auto bg-black/50 p-4 rounded-lg backdrop-blur-sm">
         <p>WASD to Move</p>
         <p>SPACE / SHIFT to Ascend/Descend</p>
         <p>MOUSE to Orbit (3rd Person)</p>
      </div>
      
    </div>
  );
};
