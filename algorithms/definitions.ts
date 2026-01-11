
import { ArrayBar, BarStatus } from '../types';

// Helper to clone array state deeply enough
export const clone = (arr: ArrayBar[]): ArrayBar[] => arr.map(item => ({ ...item }));

export const resetStatus = (arr: ArrayBar[]) => {
  arr.forEach(bar => {
    if (bar.status !== BarStatus.SORTED) bar.status = BarStatus.DEFAULT;
  });
};

export const setRangeStatus = (arr: ArrayBar[], start: number, end: number, status: BarStatus) => {
  for (let i = start; i <= end; i++) {
    if (i >= 0 && i < arr.length && arr[i].status !== BarStatus.SORTED) {
      arr[i].status = status;
    }
  }
};
