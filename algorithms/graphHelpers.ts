
import { GraphNode, GraphEdge, BarStatus } from '../types';

export const cloneGraph = (nodes: GraphNode[], edges: GraphEdge[]) => ({
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e }))
});

export const generateRandomGraph = (nodeCount: number) => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    
    // 1. Create Nodes
    for (let i = 0; i < nodeCount; i++) {
        const angle = (2 * Math.PI * i) / nodeCount;
        const radius = 35; // %
        const cx = 50;
        const cy = 50;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        nodes.push({
            id: `node-${i}`,
            label: String.fromCharCode(65 + i),
            x: x,
            y: y,
            distance: Infinity,
            status: BarStatus.DEFAULT
        });
    }

    // 2. Create Edges (Ring to ensure connectivity)
    for (let i = 0; i < nodeCount; i++) {
        const sourceIndex = i;
        const targetIndex = (i + 1) % nodeCount;
        const weight = Math.floor(Math.random() * 9) + 1; 
        
        edges.push({
            id: `edge-${sourceIndex}-${targetIndex}`,
            source: nodes[sourceIndex].id,
            target: nodes[targetIndex].id,
            weight,
            status: BarStatus.DEFAULT
        });
    }

    // 3. Add random cross edges
    const extraEdges = Math.max(2, Math.floor(nodeCount / 1.5));
    for(let k=0; k<extraEdges; k++) {
        const u = Math.floor(Math.random() * nodeCount);
        let v = Math.floor(Math.random() * nodeCount);
        let retries = 0;
        while(retries < 10 && (v === u || Math.abs(u-v) === 1 || (u===0 && v===nodeCount-1) || (u===nodeCount-1 && v===0))) {
            v = Math.floor(Math.random() * nodeCount);
            retries++;
        }
        
        const existing = edges.find(e => 
            (e.source === `node-${u}` && e.target === `node-${v}`) || 
            (e.source === `node-${v}` && e.target === `node-${u}`)
        );
        
        if(!existing && u !== v) {
             edges.push({
                id: `edge-${u}-${v}`,
                source: `node-${u}`,
                target: `node-${v}`,
                weight: Math.floor(Math.random() * 9) + 1,
                status: BarStatus.DEFAULT
            });
        }
    }

    return { nodes, edges };
};
