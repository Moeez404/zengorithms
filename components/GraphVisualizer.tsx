
import React, { useState, useRef } from 'react';
import { GraphNode, GraphEdge, BarStatus } from '../types';
import { Move } from 'lucide-react';

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ nodes, edges }) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!nodes || nodes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-100">
        Waiting for graph data...
      </div>
    );
  }

  const getNodeColor = (status: BarStatus) => {
    switch (status) {
      case BarStatus.ACTIVE: return 'bg-indigo-500 border-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-110';
      case BarStatus.COMPARING: return 'bg-amber-400 border-amber-500 text-white shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-105';
      case BarStatus.SORTED: return 'bg-emerald-500 border-emerald-600 text-white'; // Used for final path
      case BarStatus.VISITED: return 'bg-indigo-100 border-indigo-200 text-slate-500';
      default: return 'bg-white border-slate-300 text-slate-700';
    }
  };

  const getEdgeColor = (status: BarStatus) => {
    switch (status) {
      case BarStatus.ACTIVE: return '#6366f1'; // Indigo
      case BarStatus.SORTED: return '#10b981'; // Emerald (Path)
      case BarStatus.COMPARING: return '#fbbf24'; // Amber
      default: return '#cbd5e1'; // Slate-300
    }
  };

  const getEdgeWidth = (status: BarStatus) => {
     switch (status) {
      case BarStatus.ACTIVE: 
      case BarStatus.SORTED: 
      case BarStatus.COMPARING:
          return 3;
      default: return 2;
    }
  };

  return (
    <div 
        className={`h-full w-full relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
       {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
            backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
            backgroundSize: '20px 20px',
            backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      ></div>

      <div 
        className="w-full h-full relative origin-top-left"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible">
            {edges.map((edge) => {
              const source = nodes.find(n => n.id === edge.source);
              const target = nodes.find(n => n.id === edge.target);
              if (!source || !target) return null;

              // Calculate center points based on percentages
              return (
                <g key={edge.id}>
                    <line
                        x1={`${source.x}%`}
                        y1={`${source.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        stroke={getEdgeColor(edge.status)}
                        strokeWidth={getEdgeWidth(edge.status)}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                    />
                    {/* Weight Label */}
                    <rect 
                        x={`${(source.x + target.x) / 2}%`} 
                        y={`${(source.y + target.y) / 2}%`} 
                        width="20" 
                        height="20" 
                        rx="4"
                        fill="white"
                        transform="translate(-10, -10)"
                        className="opacity-90"
                    />
                    <text
                        x={`${(source.x + target.x) / 2}%`}
                        y={`${(source.y + target.y) / 2}%`}
                        fill="#64748b"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {edge.weight}
                    </text>
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute flex flex-col items-center justify-center w-12 h-12 -ml-6 -mt-6 rounded-full border-2 transition-all duration-300 z-10 ${getNodeColor(node.status)}`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
            >
              <span className="font-bold text-sm">{node.label}</span>
              <span className="text-[10px] opacity-80 font-mono">
                {node.distance === Infinity ? '∞' : node.distance}
              </span>
            </div>
          ))}
      </div>

       {/* Controls */}
       <div className="absolute top-4 right-4 flex flex-col gap-2 items-end pointer-events-none">
            <div className="bg-slate-900/5 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                Drag to Move
            </div>
       </div>

       {(pan.x !== 0 || pan.y !== 0) && (
           <button
             onClick={(e) => { e.stopPropagation(); setPan({x: 0, y: 0}); }}
             className="absolute bottom-4 right-4 p-2 bg-white shadow-md border border-slate-100 rounded-full hover:bg-slate-50 text-slate-600 transition-all active:scale-95 z-20"
             title="Reset View"
           >
             <Move size={18} />
           </button>
       )}
    </div>
  );
};

export default GraphVisualizer;
