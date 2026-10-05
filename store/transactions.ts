import { create } from 'zustand';
import { Transaction } from '../types/transaction';
import { Mount } from '../types/transaction';

type TransactionStoreState = Mount & {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  removeTransaction: (id: string) => void;
};

export const useTransactionStore = create<TransactionStoreState>((set) => ({
  mounted: false as boolean,
  transactions: [] as Transaction[],
  setMounted: (mounted: boolean) => set({ mounted }),
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
  removeTransaction: (id: string) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));
