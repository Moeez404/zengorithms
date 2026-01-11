
export enum BarStatus {
  DEFAULT = 'DEFAULT',
  COMPARING = 'COMPARING',
  SWAPPING = 'SWAPPING',
  OVERWRITING = 'OVERWRITING',
  SORTED = 'SORTED',
  ACTIVE = 'ACTIVE',     // For the current working range
  LEFT_HALF = 'LEFT_HALF', // For merge sort visualization
  RIGHT_HALF = 'RIGHT_HALF', // For merge sort visualization
  VISITED = 'VISITED' // For tree/graph traversal
}

export type AlgorithmType = 'sorting' | 'tree' | 'graph';

export interface ArrayBar {
  value: number;
  label?: string; // For visualizing non-numeric data or IDs (like in a Priority Queue)
  status: BarStatus;
  id: string; // Unique ID for React keys
  isSplitAfter?: boolean; // If true, render a gap after this bar to visualize split
}

export interface TreeNode {
  id: string;
  value: number;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  left: TreeNode | null;
  right: TreeNode | null;
  status: BarStatus;
  highlight?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  distance: number; // For pathfinding
  status: BarStatus;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  status: BarStatus;
}

export interface SortingStep {
  array: ArrayBar[];
  treeRoot?: TreeNode | null; // Optional root for tree algorithms
  graph?: { nodes: GraphNode[], edges: GraphEdge[] }; // Optional graph state
  comparedIndices: number[];
  swappedIndices: number[];
  sortedIndices: number[];
  description: string;
  codeLine?: number; // Line number to highlight in the code viewer
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Interface for a modular algorithm definition
export interface AlgorithmDefinition {
  id: string;
  name: string;
  type: AlgorithmType;
  description: string;
  code: string; // C Code representation
  generateSteps: (array: ArrayBar[]) => Generator<SortingStep>;
}
