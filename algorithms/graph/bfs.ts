
import { AlgorithmDefinition, SortingStep, BarStatus, GraphNode, GraphEdge, ArrayBar } from '../../types';
import { cloneGraph, generateRandomGraph } from '../graphHelpers';

const code = `void BFS(int startNode) {
    bool visited[V];
    for(int i = 0; i < V; i++) visited[i] = false;

    list<int> queue;
    visited[startNode] = true;
    queue.push_back(startNode);

    while(!queue.empty()) {
        int s = queue.front();
        queue.pop_front();
        
        for(auto i = adj[s].begin(); i != adj[s].end(); ++i) {
            if(!visited[*i]) {
                visited[*i] = true;
                queue.push_back(*i);
            }
        }
    }
}`;

function* generateBFSSteps(initialArray: ArrayBar[]): Generator<SortingStep> {
    const nodeCount = Math.max(3, Math.min(10, initialArray.length));
    const { nodes, edges } = generateRandomGraph(nodeCount);
    const startNode = nodes[0];

    const queue: GraphNode[] = [startNode];
    const visited = new Set<string>();
    visited.add(startNode.id);
    startNode.status = BarStatus.COMPARING; // In Queue

    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Starting BFS from Node ${startNode.label}`,
        codeLine: 7
    };

    while (queue.length > 0) {
        const current = queue.shift()!;
        current.status = BarStatus.ACTIVE; // Processing

        yield {
            array: [],
            graph: cloneGraph(nodes, edges),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `Visiting Node ${current.label}`,
            codeLine: 10
        };

        const neighbors = edges
            .filter(e => e.source === current.id || e.target === current.id)
            .map(e => {
                const nid = e.source === current.id ? e.target : e.source;
                return { node: nodes.find(n => n.id === nid)!, edge: e };
            });

        for (const { node, edge } of neighbors) {
            if (!visited.has(node.id)) {
                visited.add(node.id);
                queue.push(node);
                node.status = BarStatus.COMPARING; // Marked/Queued
                edge.status = BarStatus.SORTED; // Path taken

                yield {
                    array: [],
                    graph: cloneGraph(nodes, edges),
                    comparedIndices: [],
                    swappedIndices: [],
                    sortedIndices: [],
                    description: `Enqueuing unvisited neighbor ${node.label}`,
                    codeLine: 15
                };
            }
        }
        
        current.status = BarStatus.VISITED;
    }

    yield {
        array: [],
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "BFS Complete",
        codeLine: 20
    };
}

export const bfsGraph: AlgorithmDefinition = {
    id: 'bfs-graph',
    name: 'Breadth First Search',
    type: 'graph',
    description: "Breadth-First Search (BFS) explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.",
    code,
    generateSteps: generateBFSSteps
};
