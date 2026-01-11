
import { AlgorithmDefinition, SortingStep, BarStatus } from '../../types';
import { clone, resetStatus } from '../definitions';

const code = `void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n-1; i++) {
        min_idx = i;
        for (j = i+1; j < n; j++)
          if (arr[j] < arr[min_idx])
            min_idx = j;

        swap(&arr[min_idx], &arr[i]);
    }
}`;

function* generateSelectionSortSteps(initialArray: any[]): Generator<SortingStep> {
  let array = clone(initialArray);
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    array[i].status = BarStatus.ACTIVE; // Current position to fill

    yield {
      array: clone(array),
      comparedIndices: [],
      swappedIndices: [],
      sortedIndices: Array.from({length: i}, (_, k) => k),
      description: `Finding minimum element for index ${i}.`,
      codeLine: 4
    };

    for (let j = i + 1; j < n; j++) {
      array[j].status = BarStatus.COMPARING;
      array[minIdx].status = BarStatus.COMPARING;

      yield {
        array: clone(array),
        comparedIndices: [j, minIdx],
        swappedIndices: [],
        sortedIndices: [],
        description: `Comparing ${array[j].value} with current min ${array[minIdx].value}`,
        codeLine: 6
      };

      if (array[j].value < array[minIdx].value) {
        if (minIdx !== i) array[minIdx].status = BarStatus.DEFAULT; // Reset old min
        minIdx = j;
        array[minIdx].status = BarStatus.SWAPPING; // Highlight new min
        
        yield {
          array: clone(array),
          comparedIndices: [],
          swappedIndices: [minIdx],
          sortedIndices: [],
          description: `Found new minimum: ${array[minIdx].value}`,
          codeLine: 7
        };
      } else {
        array[j].status = BarStatus.DEFAULT;
      }
    }

    if (minIdx !== i) {
      let temp = array[minIdx].value;
      array[minIdx].value = array[i].value;
      array[i].value = temp;

      yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [i, minIdx],
        sortedIndices: [],
        description: `Swapped minimum ${temp} to index ${i}`,
        codeLine: 9
      };
    }

    array[minIdx].status = BarStatus.DEFAULT;
    array[i].status = BarStatus.SORTED;
  }
  array[n-1].status = BarStatus.SORTED;

  yield {
    array: clone(array),
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: Array.from({length: n}, (_, k) => k),
    description: "Selection Sort Complete.",
    codeLine: 11
  };
}

export const selectionSort: AlgorithmDefinition = {
  id: 'selection-sort',
  name: 'Selection Sort',
  type: 'sorting',
  description: "Selection sort sorts an array by repeatedly finding the minimum element from unsorted part and putting it at the beginning.",
  code,
  generateSteps: generateSelectionSortSteps
};
