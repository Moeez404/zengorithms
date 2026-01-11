
import { AlgorithmDefinition, SortingStep, BarStatus, TreeNode } from '../../types';
import { cloneTree, resetTreeStatus, buildBSTFromArray } from '../treeHelpers';

const code = `void printPreorder(struct Node* node) {
    if (node == NULL)
        return;
 
    // First print data of node
    printf("%d ", node->data);
 
    // Then recur on left subtree
    printPreorder(node->left);
 
    // Now recur on right subtree
    printPreorder(node->right);
}`;

function* traverse(node: TreeNode | null, array: any[], root: TreeNode | null): Generator<SortingStep> {
    if (!node) return;

    node.status = BarStatus.ACTIVE;
    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Visiting Node ${node.value}`,
        codeLine: 6
    };
    node.status = BarStatus.VISITED;

    yield* traverse(node.left, array, root);
    yield* traverse(node.right, array, root);
}

function* generatePreorderSteps(initialArray: any[]): Generator<SortingStep> {
    const values = initialArray.map(b => b.value);
    const root = buildBSTFromArray(values);

    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Tree Constructed. Starting Preorder Traversal (Root, Left, Right).",
        codeLine: 1
    };

    yield* traverse(root, initialArray, root);

    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Traversal Complete.",
        codeLine: 13
    };
}

export const preorderTraversal: AlgorithmDefinition = {
    id: 'preorder-traversal',
    name: 'Preorder Traversal',
    type: 'tree',
    description: "Preorder traversal visits the current node first, then the left subtree, and finally the right subtree.",
    code,
    generateSteps: generatePreorderSteps
};
