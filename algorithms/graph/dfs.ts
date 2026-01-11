
import { AlgorithmDefinition, SortingStep, BarStatus, GraphNode, GraphEdge, ArrayBar } from '../../types';
import { cloneGraph, generateRandomGraph } from '../graphHelpers';

const code = `void DFS(int v, bool visited[]) {
    visited[v] = true;
    cout << v << " ";
 
    list<int>::iterator i;
    for (i = adj[v].begin(); i != adj[v].end(); ++i)
        if (!visited[*i])
            DFS(*i, visited);
}`;

function* dfsRecursive(
    current: GraphNode, 
    visited: Set<string>, 
    nodes: GraphNode[], 
    edges: GraphEdge[]
): Generator<SortingStep> {
    visited.add(current.id);
    current.status = BarStatus.ACTIVE;

    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Visiting Node ${current.label}`,
        codeLine: 2
    };

    const neighbors = edges
        .filter(e => e.source === current.id || e.target === current.id)
        .map(e => {
            const nid = e.source === current.id ? e.target : e.source;
            return { node: nodes.find(n => n.id === nid)!, edge: e };
        });

    for (const { node, edge } of neighbors) {
        if (!visited.has(node.id)) {
            edge.status = BarStatus.SORTED; // Traversed
            yield* dfsRecursive(node, visited, nodes, edges);
            
            // Backtracking
            current.status = BarStatus.ACTIVE; // Return to current
            yield {
                array: [],
                graph: cloneGraph(nodes, edges),
                comparedIndices: [],
                swappedIndices: [],
                sortedIndices: [],
                description: `Backtracking to ${current.label}`,
                codeLine: 8
            };
        }
    }
    
    current.status = BarStatus.VISITED;
}

function* generateDFSSteps(initialArray: ArrayBar[]): Generator<SortingStep> {
    const nodeCount = Math.max(3, Math.min(10, initialArray.length));
    const { nodes, edges } = generateRandomGraph(nodeCount);
    const startNode = nodes[0];
    const visited = new Set<string>();

    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Starting DFS from Node ${startNode.label}`,
        codeLine: 1
    };

    yield* dfsRecursive(startNode, visited, nodes, edges);

    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "DFS Complete",
        codeLine: 9
    };
}

export const dfsGraph: AlgorithmDefinition = {
    id: 'dfs-graph',
    name: 'Depth First Search',
    type: 'graph',
    description: "Depth-First Search (DFS) explores as far as possible along each branch before backtracking.",
    code,
    generateSteps: generateDFSSteps
};
