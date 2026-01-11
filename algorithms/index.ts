
import { AlgorithmDefinition } from '../types';
import { bubbleSort } from './bubbleSort';
import { mergeSort } from './mergeSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';
import { quickSort } from './quickSort';
import { binarySearchTree } from './binarySearchTree';
import { preorderTraversal } from './treeTraversal/preorder';
import { inorderTraversal } from './treeTraversal/inorder';
import { postorderTraversal } from './treeTraversal/postorder';
import { levelOrderTraversal } from './treeTraversal/bfs';
import { dijkstra } from './dijkstra';
import { bfsGraph } from './graph/bfs';
import { dfsGraph } from './graph/dfs';
import { primsAlgorithm } from './graph/prim';
import { kruskalsAlgorithm } from './graph/kruskal';

export const ALGORITHMS: AlgorithmDefinition[] = [
  // Sorting (5)
  bubbleSort,
  mergeSort,
  insertionSort,
  selectionSort,
  quickSort,
  // Trees (5)
  binarySearchTree,
  preorderTraversal,
  inorderTraversal,
  postorderTraversal,
  levelOrderTraversal,
  // Graphs (5)
  dijkstra,
  bfsGraph,
  dfsGraph,
  primsAlgorithm,
  kruskalsAlgorithm
];

export const getAlgorithmById = (id: string): AlgorithmDefinition | undefined => {
  return ALGORITHMS.find(algo => algo.id === id);
};
