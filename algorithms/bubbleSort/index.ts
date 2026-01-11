
import { AlgorithmDefinition, SortingStep, BarStatus } from '../../types';
import { clone, resetStatus } from '../definitions';
import code from './code';

function* generateBubbleSortSteps(initialArray: any[]): Generator<SortingStep> {
  let array = clone(initialArray);
  const n = array.length;
  let swapped;
  let sortedCount = 0;

  yield {
    array: clone(array),
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    description: "Starting Bubble Sort...",
    codeLine: 1
  };

  do {
    swapped = false;
    yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: "Checking if sorted...",
        codeLine: 5 // swapped = false
    };

    const sortedIndex = n - 1 - sortedCount;
    // Fix: Ensure we don't iterate past valid range
    // The inner loop goes up to n - 1 - sortedCount
    
    for (let i = 0; i < n - 1 - sortedCount; i++) {
      // Comparing
      resetStatus(array);
      array[i].status = BarStatus.COMPARING;
      array[i + 1].status = BarStatus.COMPARING;
      
      yield {
        array: clone(array),
        comparedIndices: [i, i + 1],
        swappedIndices: [],
        sortedIndices: [],
        description: `Comparing ${array[i].value} and ${array[i+1].value}`,
        codeLine: 7 // if (arr[j] > arr[j+1])
      };

      if (array[i].value > array[i + 1].value) {
        // Swapping
        array[i].status = BarStatus.SWAPPING;
        array[i + 1].status = BarStatus.SWAPPING;
        
        let temp = array[i].value;
        array[i].value = array[i + 1].value;
        array[i + 1].value = temp;
        swapped = true;

        yield {
          array: clone(array),
          comparedIndices: [],
          swappedIndices: [i, i + 1],
          sortedIndices: [],
          description: `Swapping ${array[i].value} and ${array[i+1].value}`,
          codeLine: 8 // swap(...)
        };
      }
    }
    
    // Mark last element as sorted
    if (sortedIndex >= 0 && sortedIndex < n) {
      array[sortedIndex].status = BarStatus.SORTED;
    }
    
    yield {
      array: clone(array),
      comparedIndices: [],
      swappedIndices: [],
      sortedIndices: sortedIndex >= 0 ? [sortedIndex] : [],
      description: sortedIndex >= 0 ? `${array[sortedIndex].value} is sorted.` : 'Pass complete.',
      codeLine: 13 // break check or loop end
    };

    sortedCount++;

  } while (swapped);

  // Mark remaining as sorted
  for (let i = 0; i < n; i++) {
    array[i].status = BarStatus.SORTED;
  }
  yield {
    array: clone(array),
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: "Sorting complete!",
    codeLine: 15
  };
}

export const bubbleSort: AlgorithmDefinition = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  type: 'sorting',
  description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the input list element by element, comparing the current element with the one after it, swapping their values if needed.",
  code: code,
  generateSteps: generateBubbleSortSteps
};
