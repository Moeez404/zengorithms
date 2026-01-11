
import { AlgorithmDefinition, SortingStep, BarStatus, GraphNode, GraphEdge, ArrayBar } from '../../types';
import { cloneGraph, generateRandomGraph } from '../graphHelpers';

const code = `void primMST(int graph[V][V]) {
    int parent[V]; 
    int key[V]; 
    bool mstSet[V]; 
 
    for (int i = 0; i < V; i++) 
        key[i] = INT_MAX, mstSet[i] = false; 
 
    key[0] = 0; 
    parent[0] = -1; 
 
    for (int count = 0; count < V - 1; count++) { 
        int u = minKey(key, mstSet); 
        mstSet[u] = true; 
 
        for (int v = 0; v < V; v++) 
            if (graph[u][v] && mstSet[v] == false && graph[u][v] < key[v]) 
                parent[v] = u, key[v] = graph[u][v]; 
    } 
}`;

function* generatePrimSteps(initialArray: ArrayBar[]): Generator<SortingStep> {
    const nodeCount = Math.max(3, Math.min(10, initialArray.length));
    const { nodes, edges } = generateRandomGraph(nodeCount);

    // Initialize
    nodes.forEach(n => { n.distance = Infinity; });
    nodes[0].distance = 0;
    const parentMap = new Map<string, string>();
    const mstSet = new Set<string>();

    // Priority Queue-ish: Just finding min from unvisited array for simplicity in visualization
    // We can use the visual graph nodes as our storage
    
    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Initialized. Starting Prim's Algorithm.",
        codeLine: 9
    };

    for (let i = 0; i < nodeCount; i++) {
        // Find min key node not in mstSet
        let u: GraphNode | null = null;
        let minVal = Infinity;

        for (const node of nodes) {
            if (!mstSet.has(node.id) && node.distance < minVal) {
                minVal = node.distance;
                u = node;
            }
        }

        if (!u) break;

        mstSet.add(u.id);
        u.status = BarStatus.ACTIVE;

        // Visualize Edge Inclusion
        if (parentMap.has(u.id)) {
            const pid = parentMap.get(u.id);
            const edge = edges.find(e => 
                (e.source === u!.id && e.target === pid) || (e.target === u!.id && e.source === pid)
            );
            if (edge) edge.status = BarStatus.SORTED; // Part of MST
        }

        yield {
            array: [],
            graph: cloneGraph(nodes, edges),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `Picked ${u.label} into MST.`,
            codeLine: 13
        };

        // Update Adjacent
        const neighbors = edges.filter(e => e.source === u!.id || e.target === u!.id);
        for (const edge of neighbors) {
            const vId = edge.source === u.id ? edge.target : edge.source;
            const v = nodes.find(n => n.id === vId)!;

            if (!mstSet.has(vId)) {
                edge.status = BarStatus.COMPARING;
                yield {
                    array: [],
                    graph: cloneGraph(nodes, edges),
                    comparedIndices: [],
                    swappedIndices: [],
                    sortedIndices: [],
                    description: `Checking edge ${u.label}-${v.label} weight ${edge.weight}`,
                    codeLine: 16
                };

                if (edge.weight < v.distance) {
                    v.distance = edge.weight;
                    parentMap.set(vId, u.id);
                    yield {
                        array: [],
                        graph: cloneGraph(nodes, edges),
                        comparedIndices: [],
                        swappedIndices: [],
                        sortedIndices: [],
                        description: `Updated key for ${v.label} to ${edge.weight}`,
                        codeLine: 17
                    };
                }
                edge.status = BarStatus.DEFAULT;
            }
        }
        
        u.status = BarStatus.VISITED; // Done processing
    }

    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Prim's MST Complete. Green edges form the Tree.",
        codeLine: 19
    };
}

export const primsAlgorithm: AlgorithmDefinition = {
    id: 'prims',
    name: 'Prim\'s Algorithm',
    type: 'graph',
    description: "Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.",
    code,
    generateSteps: generatePrimSteps
};
