
import { AlgorithmDefinition, SortingStep, BarStatus } from '../../types';
import { clone, resetStatus } from '../definitions';

const code = `void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`;

function* generateInsertionSortSteps(initialArray: any[]): Generator<SortingStep> {
  let array = clone(initialArray);
  const n = array.length;

  yield {
    array: clone(array),
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: [0],
    description: "Starting Insertion Sort. First element is considered sorted.",
    codeLine: 1
  };

  for (let i = 1; i < n; i++) {
    let keyVal = array[i].value;
    array[i].status = BarStatus.ACTIVE; // The 'key'

    yield {
      array: clone(array),
      comparedIndices: [],
      swappedIndices: [],
      sortedIndices: Array.from({length: i}, (_, k) => k),
      description: `Selected ${keyVal} as key to insert.`,
      codeLine: 4
    };

    let j = i - 1;

    while (j >= 0) {
      array[j].status = BarStatus.COMPARING;
      yield {
        array: clone(array),
        comparedIndices: [j, j+1],
        swappedIndices: [],
        sortedIndices: [],
        description: `Comparing ${array[j].value} with key ${keyVal}`,
        codeLine: 7
      };

      if (array[j].value > keyVal) {
        // Shift
        array[j + 1].value = array[j].value;
        array[j].status = BarStatus.DEFAULT;
        array[j + 1].status = BarStatus.SWAPPING; 
        
        yield {
          array: clone(array),
          comparedIndices: [],
          swappedIndices: [j+1],
          sortedIndices: [],
          description: `Moving ${array[j].value} to the right.`,
          codeLine: 8
        };
        
        array[j+1].status = BarStatus.DEFAULT;
        j--;
      } else {
        array[j].status = BarStatus.DEFAULT;
        break;
      }
    }
    
    array[j + 1].value = keyVal;
    array[j + 1].status = BarStatus.SORTED;
    
    // Mark 0 to i as sorted
    for(let k=0; k<=i; k++) array[k].status = BarStatus.SORTED;

    yield {
      array: clone(array),
      comparedIndices: [],
      swappedIndices: [],
      sortedIndices: Array.from({length: i+1}, (_, k) => k),
      description: `Inserted ${keyVal} at position ${j + 1}.`,
      codeLine: 11
    };
  }
}

export const insertionSort: AlgorithmDefinition = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  type: 'sorting',
  description: "Insertion Sort builds the sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.",
  code,
  generateSteps: generateInsertionSortSteps
};
