
import React from 'react';
import { ArrayBar, BarStatus } from '../types';

interface VisualizerProps {
  array: ArrayBar[];
}

const Visualizer: React.FC<VisualizerProps> = ({ array }) => {
  
  const getBarColor = (status: BarStatus) => {
    switch (status) {
      case BarStatus.COMPARING: 
        return 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] z-10 scale-105 origin-bottom';
      case BarStatus.SWAPPING: 
        return 'bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.6)] z-10 scale-105 origin-bottom';
      case BarStatus.OVERWRITING: 
        return 'bg-purple-400';
      case BarStatus.SORTED: 
        return 'bg-emerald-400';
      case BarStatus.ACTIVE:
        return 'bg-slate-300 shadow-inner'; // Currently processed range
      case BarStatus.LEFT_HALF:
        return 'bg-sky-300'; // Left partition
      case BarStatus.RIGHT_HALF:
        return 'bg-pink-300'; // Right partition
      default: 
        return 'bg-indigo-200'; // Idle
    }
  };

  return (
    <div className="h-full w-full flex items-end justify-center gap-[2px] p-8 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      {/* Background grid lines for soothing effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="h-1/4 w-full border-b-2 border-slate-900"></div>
        <div className="h-1/4 w-full border-b-2 border-slate-900 top-1/4 absolute"></div>
        <div className="h-1/4 w-full border-b-2 border-slate-900 top-2/4 absolute"></div>
        <div className="h-full w-1/4 border-r-2 border-slate-900 absolute top-0 left-0"></div>
        <div className="h-full w-1/4 border-r-2 border-slate-900 absolute top-0 left-1/4"></div>
        <div className="h-full w-1/4 border-r-2 border-slate-900 absolute top-0 left-2/4"></div>
      </div>

      {array.map((bar) => (
        <div
          key={bar.id}
          className={`w-full max-w-[40px] rounded-t-sm transition-all duration-150 ease-out flex flex-col justify-end items-center group relative ${getBarColor(bar.status)} ${bar.isSplitAfter ? 'mr-4 md:mr-8 border-r-2 border-slate-100/50' : ''}`}
          style={{ 
            height: `${bar.value}%`,
            minHeight: '4px'
          }}
        >
          {/* Tooltip on hover */}
          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity z-20 whitespace-nowrap">
            {bar.label ? bar.label : `Val: ${bar.value}`}
          </div>

          {/* Always show value for small arrays */}
          {array.length <= 20 && (
            <span className={`block mb-[-20px] text-xs font-semibold whitespace-nowrap ${
              bar.status === BarStatus.COMPARING || bar.status === BarStatus.SWAPPING ? 'text-slate-800 font-bold' : 'text-slate-400'
            }`}>
              {bar.label ? bar.label.split(':')[0] : bar.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Visualizer;
