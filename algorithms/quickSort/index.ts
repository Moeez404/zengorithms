
import { AlgorithmDefinition, SortingStep, BarStatus } from '../../types';
import { clone, setRangeStatus, resetStatus } from '../definitions';

const code = `int partition(int arr[], int low, int high) {
    int pivot = arr[high]; 
    int i = (low - 1); 
  
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++; 
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`;

function* partition(array: any[], low: number, high: number): Generator<SortingStep> {
    const pivot = array[high].value;
    array[high].status = BarStatus.ACTIVE; // Pivot

    yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: [],
        description: `Partitioning [${low}-${high}]. Pivot: ${pivot}`,
        codeLine: 2
    };

    let i = low - 1;
    for (let j = low; j < high; j++) {
        array[j].status = BarStatus.COMPARING;
        
        yield {
            array: clone(array),
            comparedIndices: [j, high],
            swappedIndices: [],
            sortedIndices: [],
            description: `Comparing ${array[j].value} < Pivot (${pivot})?`,
            codeLine: 6
        };

        if (array[j].value < pivot) {
            i++;
            // Swap i and j
            let temp = array[i].value;
            array[i].value = array[j].value;
            array[j].value = temp;

            array[i].status = BarStatus.SWAPPING;
            array[j].status = BarStatus.SWAPPING;

            yield {
                array: clone(array),
                comparedIndices: [],
                swappedIndices: [i, j],
                sortedIndices: [],
                description: `Swapped ${array[i].value} and ${array[j].value}`,
                codeLine: 8
            };
            
            array[i].status = BarStatus.LEFT_HALF; // Less than pivot
            if(i !== j) array[j].status = BarStatus.DEFAULT;
        } else {
             array[j].status = BarStatus.RIGHT_HALF; // Greater than pivot
        }
    }
    
    // Swap i+1 and high (pivot)
    let temp = array[i + 1].value;
    array[i + 1].value = array[high].value;
    array[high].value = temp;
    
    array[high].status = BarStatus.DEFAULT;
    array[i+1].status = BarStatus.SORTED; // Pivot is now sorted

    yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [i+1, high],
        sortedIndices: [i+1],
        description: `Placed Pivot ${pivot} at index ${i+1}`,
        codeLine: 11
    };

    return i + 1;
}

function* quickSortRecursive(array: any[], low: number, high: number): Generator<SortingStep> {
    if (low < high) {
        setRangeStatus(array, low, high, BarStatus.DEFAULT);
        
        // Manual iterator for generator return
        const piGen = partition(array, low, high);
        let pi = 0;
        let result = piGen.next();
        while(!result.done) {
            yield result.value;
            result = piGen.next();
        }
        pi = result.value as number;

        yield* quickSortRecursive(array, low, pi - 1);
        yield* quickSortRecursive(array, pi + 1, high);
    } else if (low === high) {
        array[low].status = BarStatus.SORTED;
        yield {
             array: clone(array),
             comparedIndices: [],
             swappedIndices: [],
             sortedIndices: [],
             description: `Element ${array[low].value} is sorted.`,
             codeLine: 18
        };
    }
}

function* generateQuickSortSteps(initialArray: any[]): Generator<SortingStep> {
    let array = clone(initialArray);
    yield* quickSortRecursive(array, 0, array.length - 1);
    
    for(let i=0; i<array.length; i++) array[i].status = BarStatus.SORTED;

    yield {
        array: clone(array),
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: array.map((_, i) => i),
        description: "Quick Sort Complete.",
        codeLine: 20
    };
}

export const quickSort: AlgorithmDefinition = {
  id: 'quick-sort',
  name: 'Quick Sort',
  type: 'sorting',
  description: "QuickSort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.",
  code,
  generateSteps: generateQuickSortSteps
};
