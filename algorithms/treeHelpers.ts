
import { TreeNode, BarStatus } from '../types';
import { TREE_ROOT_Y, TREE_LAYER_HEIGHT } from '../constants';

export const cloneTree = (node: TreeNode | null): TreeNode | null => {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
};

export const resetTreeStatus = (node: TreeNode | null) => {
  if (!node) return;
  if (node.status !== BarStatus.SORTED) node.status = BarStatus.DEFAULT;
  resetTreeStatus(node.left);
  resetTreeStatus(node.right);
};

// Helper to insert a value into a BST structure
export const insertIntoBST = (root: TreeNode | null, val: number, id: string, x: number, y: number, rangeX: number): TreeNode => {
    if (!root) {
        return {
            id,
            value: val,
            x,
            y,
            left: null,
            right: null,
            status: BarStatus.DEFAULT
        };
    }
    
    // Simple BST insertion logic with positioning
    // Note: The positioning logic here is simplified for static generation.
    // Real-time visualization handles positioning dynamically in the generator.
    if (val < root.value) {
        root.left = insertIntoBST(root.left, val, id, root.x - rangeX / 2, root.y + TREE_LAYER_HEIGHT, rangeX / 2);
    } else {
        root.right = insertIntoBST(root.right, val, id, root.x + rangeX / 2, root.y + TREE_LAYER_HEIGHT, rangeX / 2);
    }
    return root;
};

export const buildBSTFromArray = (values: number[]): TreeNode | null => {
    let root: TreeNode | null = null;
    values.forEach((val, i) => {
       // We use a simplified iterative approach to reuse the 'insertValue' logic logic if needed,
       // but here we just need a quick structure builder.
       // Re-implementing a simple inserter for the helper:
       const insert = (node: TreeNode | null, v: number, idx: number, x: number, y: number, dx: number): TreeNode => {
           if (!node) return { id: `node-${idx}`, value: v, x, y, left: null, right: null, status: BarStatus.DEFAULT };
           if (v < node.value) {
               node.left = insert(node.left, v, idx, x - dx, y + TREE_LAYER_HEIGHT, dx / 2);
           } else {
               node.right = insert(node.right, v, idx, x + dx, y + TREE_LAYER_HEIGHT, dx / 2);
           }
           return node;
       };
       root = insert(root, val, i, 50, TREE_ROOT_Y, 25);
    });
    return root;
};
