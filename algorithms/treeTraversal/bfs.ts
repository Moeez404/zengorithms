
import { AlgorithmDefinition, SortingStep, BarStatus, TreeNode } from '../../types';
import { cloneTree, buildBSTFromArray } from '../treeHelpers';

const code = `void printLevelOrder(struct Node* root) {
    if (root == NULL) return;
    Queue q;
    enqueue(&q, root);
 
    while (!isEmpty(&q)) {
        struct Node* temp_node = dequeue(&q);
        printf("%d ", temp_node->data);
 
        if (temp_node->left != NULL)
            enqueue(&q, temp_node->left);
 
        if (temp_node->right != NULL)
            enqueue(&q, temp_node->right);
    }
}`;

function* generateLevelOrderSteps(initialArray: any[]): Generator<SortingStep> {
    const values = initialArray.map(b => b.value);
    const root = buildBSTFromArray(values);

    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Tree Constructed. Starting Level Order Traversal (BFS).",
        codeLine: 4 // Create Queue
    };

    if (!root) return;

    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
        const node = queue.shift()!;
        
        node.status = BarStatus.ACTIVE;
        yield {
            array: [],
            treeRoot: cloneTree(root),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `Dequeued & Visiting Node ${node.value}`,
            codeLine: 8 // print
        };
        node.status = BarStatus.VISITED;

        if (node.left) {
            queue.push(node.left);
            node.left.status = BarStatus.COMPARING; // In queue
             yield {
                array: [],
                treeRoot: cloneTree(root),
                comparedIndices: [],
                swappedIndices: [],
                sortedIndices: [],
                description: `Enqueuing Left Child ${node.left.value}`,
                codeLine: 11
            };
        }
        if (node.right) {
            queue.push(node.right);
            node.right.status = BarStatus.COMPARING; // In queue
             yield {
                array: [],
                treeRoot: cloneTree(root),
                comparedIndices: [],
                swappedIndices: [],
                sortedIndices: [],
                description: `Enqueuing Right Child ${node.right.value}`,
                codeLine: 14
            };
        }
    }

    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Traversal Complete.",
        codeLine: 16
    };
}

export const levelOrderTraversal: AlgorithmDefinition = {
    id: 'level-order-traversal',
    name: 'Level Order Traversal',
    type: 'tree',
    description: "Level order traversal visits nodes level by level from left to right, typically using a Queue.",
    code,
    generateSteps: generateLevelOrderSteps
};
