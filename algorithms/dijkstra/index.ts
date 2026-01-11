
import { AlgorithmDefinition, SortingStep, BarStatus, GraphNode, GraphEdge, ArrayBar } from '../../types';
import { cloneGraph, generateRandomGraph } from '../graphHelpers';
import code from './code';

function* generateDijkstraSteps(initialArray: ArrayBar[]): Generator<SortingStep> {
    const nodeCount = Math.max(3, Math.min(10, initialArray.length));
    const { nodes, edges } = generateRandomGraph(nodeCount);
    const startNodeIndex = 0;
    
    // Initial State
    nodes[startNodeIndex].distance = 0;
    nodes[startNodeIndex].status = BarStatus.ACTIVE;

    // Priority Queue: [Node Label, Distance]
    let pq: { id: string, dist: number, label: string }[] = [
        { id: nodes[startNodeIndex].id, dist: 0, label: nodes[startNodeIndex].label }
    ];

    const updatePQDisplay = (): ArrayBar[] => {
        return pq.map((item, idx) => ({
            id: `pq-${idx}`,
            value: item.dist === Infinity ? 100 : Math.min(100, (item.dist + 5) * 5),
            label: `${item.label}:${item.dist}`,
            status: BarStatus.DEFAULT
        }));
    };

    yield {
        array: updatePQDisplay(),
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Initialized graph with ${nodeCount} nodes. Source: ${nodes[startNodeIndex].label}`,
        codeLine: 11
    };

    const visited = new Set<string>();
    const parentMap = new Map<string, string>();

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        
        yield {
            array: updatePQDisplay(),
            graph: cloneGraph(nodes, edges),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `Priority Queue sorted: [${pq.map(i => i.label + ':' + i.dist).join(', ')}]`,
            codeLine: 16
        };

        const current = pq.shift()!;
        const currentNode = nodes.find(n => n.id === current.id)!;

        currentNode.status = BarStatus.ACTIVE;
        visited.add(current.id);

        yield {
            array: updatePQDisplay(),
            graph: cloneGraph(nodes, edges),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `Visiting Node ${currentNode.label} (Min Dist: ${current.dist})`,
            codeLine: 19
        };

        const relevantEdges = edges.filter(e => e.source === current.id || e.target === current.id);

        for (const edge of relevantEdges) {
            const neighborId = edge.source === current.id ? edge.target : edge.source;
            const neighborNode = nodes.find(n => n.id === neighborId)!;

            if (visited.has(neighborId)) continue;

            edge.status = BarStatus.COMPARING;
            neighborNode.status = BarStatus.COMPARING;

            yield {
                array: updatePQDisplay(),
                graph: cloneGraph(nodes, edges),
                comparedIndices: [],
                swappedIndices: [],
                sortedIndices: [],
                description: `Checking neighbor ${neighborNode.label} (edge weight ${edge.weight})`,
                codeLine: 26
            };

            const newDist = currentNode.distance + edge.weight;
            
            if (newDist < neighborNode.distance) {
                neighborNode.distance = newDist;
                parentMap.set(neighborId, currentNode.id);
                
                const existingPQ = pq.find(p => p.id === neighborId);
                if (existingPQ) {
                    existingPQ.dist = newDist;
                } else {
                    pq.push({ id: neighborId, dist: newDist, label: neighborNode.label });
                }

                yield {
                    array: updatePQDisplay(),
                    graph: cloneGraph(nodes, edges),
                    comparedIndices: [],
                    swappedIndices: [],
                    sortedIndices: [],
                    description: `New shorter path for ${neighborNode.label}! Dist: ${newDist}`,
                    codeLine: 29
                };
            }

            edge.status = BarStatus.DEFAULT;
            if(!visited.has(neighborId)) neighborNode.status = BarStatus.DEFAULT;
        }

        currentNode.status = BarStatus.VISITED;
        
        yield {
            array: updatePQDisplay(),
            graph: cloneGraph(nodes, edges),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `Finished processing Node ${currentNode.label}`,
            codeLine: 14
        };
    }

    // Highlight Path
    for (const [childId, parentId] of parentMap.entries()) {
        const edge = edges.find(e => 
            (e.source === childId && e.target === parentId) || 
            (e.source === parentId && e.target === childId)
        );
        if (edge) edge.status = BarStatus.SORTED;
        
        const node = nodes.find(n => n.id === childId);
        if (node) node.status = BarStatus.SORTED;
    }
    nodes[startNodeIndex].status = BarStatus.SORTED;

    yield {
        array: updatePQDisplay(),
        graph: cloneGraph(nodes, edges),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Dijkstra's Algorithm Complete.",
        codeLine: 33
    };
}

export const dijkstra: AlgorithmDefinition = {
    id: 'dijkstra',
    name: 'Dijkstra Pathfinding',
    type: 'graph',
    description: "Finds the shortest paths between nodes in a graph. It works by maintaining a set of visited vertices and always selecting the unvisited vertex with the smallest distance from the source.",
    code: code,
    generateSteps: generateDijkstraSteps
};
