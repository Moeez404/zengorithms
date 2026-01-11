
import { AlgorithmDefinition, SortingStep, BarStatus } from '../../types';
import { clone, resetStatus, setRangeStatus } from '../definitions';
import code from './code';

// Merge Sort Helpers
function* merge(
  array: any[], 
  start: number, 
  mid: number, 
  end: number
): Generator<SortingStep> {
  let start2 = mid + 1;

  // VISUAL: Remove the split gap because we are now merging these two parts
  if (array[mid]) {
    array[mid].isSplitAfter = false;
  }

  // Visualizing the two halves before merge
  resetStatus(array);
  setRangeStatus(array, start, mid, BarStatus.LEFT_HALF);
  setRangeStatus(array, mid + 1, end, BarStatus.RIGHT_HALF);
  
  yield {
    array: clone(array),
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    description: `Merging partitions: [${start}-${mid}] and [${mid+1}-${end}]`,
    codeLine: 23 // merge(...) call
  };

  // If the direct merge is already sorted
  if (array[mid].value <= array[start2].value) {
    yield {
      array: clone(array),
      comparedIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      description: `Partitions are already in order.`,
      codeLine: 23 
    };
    return;
  }

  while (start <= mid && start2 <= end) {
    // Visualize comparison
    resetStatus(array);
    setRangeStatus(array, start, mid, BarStatus.LEFT_HALF);
    setRangeStatus(array, start2, end, BarStatus.RIGHT_HALF);
    
    array[start].status = BarStatus.COMPARING;
    array[start2].status = BarStatus.COMPARING;
    
    yield {
      array: clone(array),
      comparedIndices: [start, start2],
      swappedIndices: [],
      sortedIndices: [],
      description: `Comparing ${array[start].value} vs ${array[start2].value}`,
      codeLine: 11 // Inside merge logic
    };

    if (array[start].value <= array[start2].value) {
      start++;
      yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `${array[start-1].value} is in correct place`,
        codeLine: 11 
      };
    } else {
      let value = array[start2].value;
      let index = start2;

      // Shift all elements between element 1 and element 2 right by 1.
      while (index !== start) {
        array[index].value = array[index - 1].value;
        index--;
      }
      
      array[start].value = value;
      array[start].status = BarStatus.SWAPPING; // Highlight the insertion

      // Restore partition colors
      setRangeStatus(array, start + 1, mid + 1, BarStatus.LEFT_HALF);
      setRangeStatus(array, start2 + 1, end, BarStatus.RIGHT_HALF);

      yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [start],
        sortedIndices: [],
        description: `Moving ${value} to index ${start}`,
        codeLine: 11 // Inside merge logic
      };

      start++;
      mid++;
      start2++;
      
      yield {
         array: clone(array),
         comparedIndices: [],
         swappedIndices: [],
         sortedIndices: [],
         description: `Indices updated`,
         codeLine: 11 
      };
    }
  }
}

function* mergeSortRecursive(
  array: any[], 
  l: number, 
  r: number
): Generator<SortingStep> {
  if (l < r) {
    let m = l + Math.floor((r - l) / 2);

    // VISUALIZE SPLIT: Highlight active range
    resetStatus(array);
    setRangeStatus(array, l, r, BarStatus.ACTIVE);
    yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Processing range [${l} ... ${r}]`,
        codeLine: 14 
    };
    
    // VISUALIZE SPLIT: Apply Color and Gap
    resetStatus(array);
    setRangeStatus(array, l, m, BarStatus.LEFT_HALF);
    setRangeStatus(array, m + 1, r, BarStatus.RIGHT_HALF);
    
    // Set the split flag
    if (array[m]) {
        array[m].isSplitAfter = true;
    }

    yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Splitting at index ${m}. Left: [${l}-${m}], Right: [${m+1}-${r}]`,
        codeLine: 17 // int m = ...
    };

    yield* mergeSortRecursive(array, l, m);
    
    // When returning from left recursion
    // We can highlight that we are done with left
    
    yield* mergeSortRecursive(array, m + 1, r);
    
    // Before Merge
    yield {
         array: clone(array),
         comparedIndices: [],
         swappedIndices: [],
         sortedIndices: [],
         description: `Both halves sorted. Merging...`,
         codeLine: 23 // merge(...)
    };

    yield* merge(array, l, m, r);
  }
}

function* generateMergeSortSteps(initialArray: any[]): Generator<SortingStep> {
  let array = clone(initialArray);
  yield {
     array: clone(array),
     comparedIndices: [],
     swappedIndices: [],
     sortedIndices: [],
     description: "Starting Merge Sort",
     codeLine: 14 // mergeSort function start
  };
  
  yield* mergeSortRecursive(array, 0, array.length - 1);
  
  // Cleanup any left over split flags
  array.forEach(bar => bar.isSplitAfter = false);

  // Mark all as sorted at the end
  for(let i=0; i<array.length; i++) {
    array[i].status = BarStatus.SORTED;
  }
  yield {
    array: clone(array),
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: array.map((_, i) => i),
    description: "Merge Sort Complete!",
    codeLine: 25 
  };
}

export const mergeSort: AlgorithmDefinition = {
  id: 'merge-sort',
  name: 'Merge Sort',
  type: 'sorting',
  description: "Merge Sort is an efficient, stable, comparison-based sorting algorithm. It works by dividing the unsorted list into n sublists, each containing one element, then repeatedly merging sublists to produce new sorted sublists until there is only one sublist remaining.",
  code: code,
  generateSteps: generateMergeSortSteps
};
