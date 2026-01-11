
import React, { useState, useRef } from 'react';
import { TreeNode, BarStatus } from '../types';
import { Move } from 'lucide-react';

interface TreeVisualizerProps {
  root: TreeNode | null | undefined;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ root }) => {
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

  if (!root) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-100">
        Waiting for data...
      </div>
    );
  }

  // Helper to flatten tree into nodes and edges for rendering
  const flattenTree = (node: TreeNode | null, nodes: TreeNode[] = [], edges: {x1:number, y1:number, x2:number, y2:number, id: string}[] = []) => {
    if (!node) return { nodes, edges };

    nodes.push(node);

    if (node.left) {
      edges.push({
        id: `${node.id}-left-${node.left.id}`,
        x1: node.x,
        y1: node.y,
        x2: node.left.x,
        y2: node.left.y
      });
      flattenTree(node.left, nodes, edges);
    }

    if (node.right) {
      edges.push({
        id: `${node.id}-right-${node.right.id}`,
        x1: node.x,
        y1: node.y,
        x2: node.right.x,
        y2: node.right.y
      });
      flattenTree(node.right, nodes, edges);
    }

    return { nodes, edges };
  };

  const { nodes, edges } = flattenTree(root);

  const getNodeColor = (status: BarStatus) => {
    switch (status) {
      case BarStatus.COMPARING: return 'bg-amber-400 border-amber-500 text-white shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-110';
      case BarStatus.ACTIVE: return 'bg-indigo-500 border-indigo-600 text-white shadow-lg scale-110'; 
      case BarStatus.SORTED: return 'bg-emerald-400 border-emerald-500 text-white';
      case BarStatus.VISITED: return 'bg-slate-200 border-slate-300 text-slate-500';
      default: return 'bg-white border-slate-300 text-slate-700';
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
      
      {/* Background Grid - Moves with Pan */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
            backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
            backgroundSize: '20px 20px',
            backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      ></div>

      {/* Pannable Container */}
      <div 
        className="w-full h-full relative origin-top-left"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
          {/* Edges (SVG Overlay) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {edges.map((edge) => (
              <line
                key={edge.id}
                x1={`${edge.x1}%`}
                y1={`${edge.y1}%`}
                x2={`${edge.x2}%`}
                y2={`${edge.y2}%`}
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute flex items-center justify-center w-10 h-10 -ml-5 -mt-5 rounded-full border-2 font-bold text-sm transition-colors duration-300 z-10 ${getNodeColor(node.status)}`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
            >
              {node.value}
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

export default TreeVisualizer;
