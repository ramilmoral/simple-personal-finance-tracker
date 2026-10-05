import { create } from 'zustand';

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

type FilterStates = {
  amount: string;
  filterType: string;
  filterCategory: string;
  filterMonth: string;
  type: 'income' | 'expense';
  date: string;
  category: string;
  error: string;
  description: string;
  setAmount: (amount: string) => void;
  setFilterType: (filterType: string) => void;
  setFilterCategory: (filterCategory: string) => void;
  setFilterMonth: (filterMonth: string) => void;
  setType: (type: 'income' | 'expense') => void;
  setDate: (date: string) => void;
  setCategory: (category: string) => void;
  setError: (error: string) => void;
  setDescription: (description: string) => void;
};

export const useFilterStates = create<FilterStates>((set) => ({
  filterType: 'All',
  filterCategory: 'All',
  filterMonth: 'All',
  amount: '',
  type: 'expense',
  date: getTodayDate(),
  category: '',
  error: '',
  description: '',
  setAmount: (amount: string) => set({ amount }),
  setFilterType: (filterType: string) => set({ filterType }),
  setFilterCategory: (filterCategory: string) => set({ filterCategory }),
  setFilterMonth: (filterMonth: string) => set({ filterMonth }),
  setType: (type: 'income' | 'expense') => set({ type }),
  setDate: (date: string) => set({ date }),
  setCategory: (category: string) => set({ category }),
  setError: (error: string) => set({ error }),
  setDescription: (description: string) => set({ description }),
}));
