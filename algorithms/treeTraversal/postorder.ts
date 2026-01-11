
import { AlgorithmDefinition, SortingStep, BarStatus, TreeNode } from '../../types';
import { cloneTree, buildBSTFromArray } from '../treeHelpers';

const code = `void printPostorder(struct Node* node) {
    if (node == NULL)
        return;
 
    // First recur on left subtree
    printPostorder(node->left);
 
    // Then recur on right subtree
    printPostorder(node->right);
 
    // Now deal with the node
    printf("%d ", node->data);
}`;

function* traverse(node: TreeNode | null, root: TreeNode | null): Generator<SortingStep> {
    if (!node) return;

    yield* traverse(node.left, root);
    yield* traverse(node.right, root);

    node.status = BarStatus.ACTIVE;
    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Visiting Node ${node.value}`,
        codeLine: 12
    };
    node.status = BarStatus.VISITED;
}

function* generatePostorderSteps(initialArray: any[]): Generator<SortingStep> {
    const values = initialArray.map(b => b.value);
    const root = buildBSTFromArray(values);

    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Tree Constructed. Starting Postorder Traversal (Left, Right, Root).",
        codeLine: 1
    };

    yield* traverse(root, root);

    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Traversal Complete.",
        codeLine: 14
    };
}

export const postorderTraversal: AlgorithmDefinition = {
    id: 'postorder-traversal',
    name: 'Postorder Traversal',
    type: 'tree',
    description: "Postorder traversal visits the left subtree, then the right subtree, and finally the current node.",
    code,
    generateSteps: generatePostorderSteps
};
