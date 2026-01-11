import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { ALGORITHMS } from '../algorithms';
import { AlgorithmType } from '../types';

interface ControlsProps {
  selectedAlgoId: string;
  setSelectedAlgoId: (id: string) => void;
  arraySize: number;
  setArraySize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  isSorted: boolean;
}

const CATEGORIES: { id: AlgorithmType; label: string }[] = [
  { id: 'sorting', label: 'Sorting' },
  { id: 'tree', label: 'Trees' },
  { id: 'graph', label: 'Graphs' },
];

const Controls: React.FC<ControlsProps> = ({
  selectedAlgoId,
  setSelectedAlgoId,
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  isSorted
}) => {
  const [activeCategory, setActiveCategory] = useState<AlgorithmType>('sorting');
  
  const BASE_SPEED = 1600;
  const currentMultiplier = Math.max(1, Math.round(BASE_SPEED / speed));

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSpeed(BASE_SPEED / val);
  };

  // Sync active category if selected algorithm changes externally (e.g. init)
  useEffect(() => {
    const algo = ALGORITHMS.find(a => a.id === selectedAlgoId);
    if (algo && algo.type !== activeCategory) {
      setActiveCategory(algo.type);
    }
  }, [selectedAlgoId]);

  const filteredAlgorithms = ALGORITHMS.filter(algo => algo.type === activeCategory);

  const getMaxArraySize = () => {
      switch(activeCategory) {
          case 'sorting': return "50";
          case 'tree': return "15";
          case 'graph': return "10"; // Limit to 10 nodes for graph to prevent clutter
          default: return "50";
      }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
      
      {/* Category Tabs */}
      <div className="flex border-b border-slate-100 pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
                if(!isPlaying) {
                    setActiveCategory(cat.id);
                    // Select first algo of that category
                    const first = ALGORITHMS.find(a => a.type === cat.id);
                    if (first) setSelectedAlgoId(first.id);
                }
            }}
            disabled={isPlaying}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeCategory === cat.id 
                ? 'text-indigo-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Algorithm Selection Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
          {filteredAlgorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => !isPlaying && setSelectedAlgoId(algo.id)}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedAlgoId === algo.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 disabled:opacity-50'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
           <button
            onClick={onReset}
            className="p-3 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={isSorted && !isPlaying}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95 ${
              isSorted && !isPlaying ? 'bg-emerald-400' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {isSorted ? (
                <>Done!</>
            ) : isPlaying ? (
              <>
                <Pause size={20} fill="currentColor" /> Pause
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" /> Start
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span>{activeCategory === 'sorting' ? 'Array Size' : activeCategory === 'tree' ? 'Node Count' : 'Node Count'}</span>
            <span>{arraySize}</span>
          </div>
          <input
            type="range"
            min="3"
            max={getMaxArraySize()}
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wider">
             <span>Speed Multiplier</span>
             <span>{currentMultiplier}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="16"
            step="1"
            value={currentMultiplier}
            onChange={handleSpeedChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;