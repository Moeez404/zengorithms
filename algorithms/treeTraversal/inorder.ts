
import { AlgorithmDefinition, SortingStep, BarStatus, TreeNode } from '../../types';
import { cloneTree, buildBSTFromArray } from '../treeHelpers';

const code = `void printInorder(struct Node* node) {
    if (node == NULL)
        return;
 
    // First recur on left child
    printInorder(node->left);
 
    // Then print the data of node
    printf("%d ", node->data);
 
    // Now recur on right child
    printInorder(node->right);
}`;

function* traverse(node: TreeNode | null, root: TreeNode | null): Generator<SortingStep> {
    if (!node) return;

    yield* traverse(node.left, root);

    node.status = BarStatus.ACTIVE;
    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Visiting Node ${node.value}`,
        codeLine: 9
    };
    node.status = BarStatus.VISITED;

    yield* traverse(node.right, root);
}

function* generateInorderSteps(initialArray: any[]): Generator<SortingStep> {
    const values = initialArray.map(b => b.value);
    const root = buildBSTFromArray(values);

    yield {
        array: [],
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Tree Constructed. Starting Inorder Traversal (Left, Root, Right).",
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
        codeLine: 13
    };
}

export const inorderTraversal: AlgorithmDefinition = {
    id: 'inorder-traversal',
    name: 'Inorder Traversal',
    type: 'tree',
    description: "Inorder traversal visits the left subtree, then the current node, and finally the right subtree. For a BST, this visits nodes in ascending order.",
    code,
    generateSteps: generateInorderSteps
};
