
import { AlgorithmDefinition, SortingStep, BarStatus, GraphNode, GraphEdge, ArrayBar } from '../../types';
import { cloneGraph, generateRandomGraph } from '../graphHelpers';

const code = `void KruskalMST(Graph* graph) {
    int V = graph->V;
    vector<Edge> result; 
    int e = 0; 
    int i = 0; 
 
    qsort(graph->edge, graph->E, sizeof(graph->edge[0]), myComp); 
 
    subset *subsets = new subset[( V * sizeof(subset) )]; 
    for (int v = 0; v < V; ++v) { 
        subsets[v].parent = v; 
        subsets[v].rank = 0; 
    } 
 
    while (e < V - 1 && i < graph->E) { 
        Edge next_edge = graph->edge[i++]; 
        int x = find(subsets, next_edge.src); 
        int y = find(subsets, next_edge.dest); 
 
        if (x != y) { 
            result.push_back(next_edge); 
            Union(subsets, x, y); 
        } 
    } 
}`;

class DisjointSet {
    parent: {[key: string]: string} = {};
    constructor(nodes: GraphNode[]) {
        nodes.forEach(n => this.parent[n.id] = n.id);
    }
    find(id: string): string {
        if (this.parent[id] === id) return id;
        return this.find(this.parent[id]);
    }
    union(id1: string, id2: string) {
        const root1 = this.find(id1);
        const root2 = this.find(id2);
        if (root1 !== root2) {
            this.parent[root1] = root2;
            return true;
        }
        return false;
    }
}

function* generateKruskalSteps(initialArray: ArrayBar[]): Generator<SortingStep> {
    const nodeCount = Math.max(3, Math.min(10, initialArray.length));
    const { nodes, edges } = generateRandomGraph(nodeCount);

    // Sort edges by weight
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const ds = new DisjointSet(nodes);

    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Edges sorted by weight. Processing...",
        codeLine: 6
    };

    let edgesCount = 0;
    for (const edge of sortedEdges) {
        if (edgesCount >= nodeCount - 1) break;

        edge.status = BarStatus.COMPARING;
        yield {
            array: [],
            graph: cloneGraph(nodes, edges),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `Checking Edge ${edge.weight} connecting ${edge.source}-${edge.target}`,
            codeLine: 15
        };

        const root1 = ds.find(edge.source);
        const root2 = ds.find(edge.target);

        if (root1 !== root2) {
            ds.union(edge.source, edge.target);
            edge.status = BarStatus.SORTED; // Added to MST
            edgesCount++;
            yield {
                array: [],
                graph: cloneGraph(nodes, edges),
                comparedIndices: [],
                swappedIndices: [],
                sortedIndices: [],
                description: `No cycle formed. Added edge to MST.`,
                codeLine: 19 // Union
            };
        } else {
            edge.status = BarStatus.VISITED; // Rejected (Gray)
            yield {
                array: [],
                graph: cloneGraph(nodes, edges),
                comparedIndices: [],
                swappedIndices: [],
                sortedIndices: [],
                description: `Cycle detected! Discarding edge.`,
                codeLine: 18 // If condition failed
            };
        }
    }

    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Kruskal's MST Complete.",
        codeLine: 24
    };
}

export const kruskalsAlgorithm: AlgorithmDefinition = {
    id: 'kruskal',
    name: 'Kruskal\'s Algorithm',
    type: 'graph',
    description: "Kruskal's algorithm finds a minimum spanning forest of an undirected edge-weighted graph by greedily adding the lowest weight edges that don't form a cycle.",
    code,
    generateSteps: generateKruskalSteps
};
