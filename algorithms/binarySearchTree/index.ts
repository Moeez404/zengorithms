
import { AlgorithmDefinition, SortingStep, BarStatus, TreeNode, ArrayBar } from '../../types';
import { clone } from '../definitions';
import { TREE_ROOT_Y, TREE_LAYER_HEIGHT } from '../../constants';
import code from './code';

// Helper to deep clone the tree for state preservation
function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
}

// Helper to reset tree highlights
function resetTreeStatus(node: TreeNode | null) {
  if (!node) return;
  if (node.status !== BarStatus.SORTED) node.status = BarStatus.DEFAULT;
  resetTreeStatus(node.left);
  resetTreeStatus(node.right);
}

function* generateBSTSteps(initialArray: ArrayBar[]): Generator<SortingStep> {
  const values = initialArray.map(b => b.value);
  let root: TreeNode | null = null;
  
  // Initial empty state
  yield {
    array: initialArray, // Keep array visible if needed, or just for context
    treeRoot: null,
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    description: "Starting Binary Search Tree construction...",
    codeLine: 28
  };

  // Helper to insert a single value
  function* insertValue(val: number, id: string): Generator<SortingStep> {
    if (!root) {
      root = {
        id,
        value: val,
        x: 50,
        y: TREE_ROOT_Y,
        left: null,
        right: null,
        status: BarStatus.ACTIVE
      };
      yield {
        array: initialArray,
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Inserting root node ${val}`,
        codeLine: 16 // newNode call
      };
      root.status = BarStatus.DEFAULT;
      return;
    }

    let current = root;
    let depth = 0;
    // Track X bounds for positioning: [min, max]
    let minX = 0;
    let maxX = 100;

    // Traversal
    while (true) {
      resetTreeStatus(root);
      current.status = BarStatus.COMPARING;
      
      yield {
        array: initialArray,
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Comparing ${val} with ${current.value}`,
        codeLine: 19 // Comparison logic
      };

      if (val < current.value) {
        // Go Left
        maxX = current.x; // Constrain max x to parent's x
        if (current.left === null) {
          // Insert Here
          const newX = (minX + maxX) / 2;
          current.left = {
            id,
            value: val,
            x: newX,
            y: current.y + TREE_LAYER_HEIGHT,
            left: null,
            right: null,
            status: BarStatus.ACTIVE
          };
          yield {
            array: initialArray,
            treeRoot: cloneTree(root),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `${val} < ${current.value}, inserting to the left.`,
            codeLine: 20 // node->left = insert(...)
          };
          current.status = BarStatus.DEFAULT;
          current.left.status = BarStatus.DEFAULT;
          break;
        }
        current.status = BarStatus.VISITED; // Mark path
        current = current.left;
        yield {
            array: initialArray,
            treeRoot: cloneTree(root),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `${val} < ${current.value}, moving left.`,
            codeLine: 20
        };
      } else {
        // Go Right (>=)
        minX = current.x; // Constrain min x to parent's x
        if (current.right === null) {
          // Insert Here
          const newX = (minX + maxX) / 2;
          current.right = {
            id,
            value: val,
            x: newX,
            y: current.y + TREE_LAYER_HEIGHT,
            left: null,
            right: null,
            status: BarStatus.ACTIVE
          };
          yield {
            array: initialArray,
            treeRoot: cloneTree(root),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `${val} >= ${current.value}, inserting to the right.`,
            codeLine: 22 // node->right = insert(...)
          };
          current.status = BarStatus.DEFAULT;
          current.right.status = BarStatus.DEFAULT;
          break;
        }
        current.status = BarStatus.VISITED;
        current = current.right;
        yield {
            array: initialArray,
            treeRoot: cloneTree(root),
            comparedIndices: [],
            swappedIndices: [],
            sortedIndices: [],
            description: `${val} >= ${current.value}, moving right.`,
            codeLine: 22
        };
      }
      depth++;
    }
  }

  // Iterate through array and insert
  for (let i = 0; i < values.length; i++) {
     // Highlight the array bar being inserted
     const arrClone = clone(initialArray);
     arrClone[i].status = BarStatus.ACTIVE;
     
     yield {
        array: arrClone,
        treeRoot: cloneTree(root),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Next value to insert: ${values[i]}`,
        codeLine: 28 // Main loop
     };

     yield* insertValue(values[i], `node-${i}`);
  }

  resetTreeStatus(root);
  // Mark all as sorted (or final)
  // Simple traversal to mark green
  const markSorted = (n: TreeNode | null) => {
      if(!n) return;
      n.status = BarStatus.SORTED;
      markSorted(n.left);
      markSorted(n.right);
  }
  markSorted(root);

  yield {
    array: initialArray,
    treeRoot: cloneTree(root),
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    description: "Binary Search Tree construction complete!",
    codeLine: 30
  };
}

export const binarySearchTree: AlgorithmDefinition = {
  id: 'binary-search-tree',
  name: 'Binary Search Tree',
  type: 'tree',
  description: "A Binary Search Tree (BST) is a node-based binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key.",
  code: code,
  generateSteps: generateBSTSteps
};
