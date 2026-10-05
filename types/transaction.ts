export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
};

export type Mount = {
  mounted: boolean;
  setMounted: (mounted: boolean) => void;
};
