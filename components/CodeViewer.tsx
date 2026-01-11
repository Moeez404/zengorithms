
import React, { useMemo, useEffect, useRef } from 'react';

interface CodeViewerProps {
  code: string;
  activeLine?: number;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, activeLine }) => {
  const lines = useMemo(() => code.split('\n'), [code]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optional: Auto-scroll logic if lines are out of view
  }, [activeLine]);

  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden flex flex-col h-full min-h-[300px]">
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
         <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
         </div>
         <span className="text-slate-400 text-xs font-mono ml-2">source.c</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm leading-6"
      >
        {lines.map((line, index) => (
          <div 
            key={index} 
            ref={activeLine === index + 1 ? activeLineRef : null}
            className={`flex transition-colors duration-200 ${
              activeLine === index + 1 ? 'bg-slate-800/80 -mx-4 px-4' : ''
            }`}
          >
            <span className={`select-none w-8 text-right mr-4 shrink-0 ${
               activeLine === index + 1 ? 'text-indigo-400 font-bold' : 'text-slate-600'
            }`}>
              {index + 1}
            </span>
            <span className={`${
              activeLine === index + 1 ? 'text-slate-100' : 'text-slate-400'
            }`}>
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeViewer;
