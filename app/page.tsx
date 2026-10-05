'use client';

import { Transaction } from '@/types/transaction';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useFilterStates, useTransactionStore, useUiStates } from '../store';

export default function FinanceTracker() {
  // 1. Extract static actions instantly (No selectors needed, safe from re-renders)
  const { setMounted, setTransactions, removeTransaction } =
    useTransactionStore.getState();
  const {
    setShowSplash,
    setSplashFading,
    setDontShowSplash,
    setToastMessage,
    setItemToDelete,
  } = useUiStates.getState();
  const {
    setAmount,
    setType,
    setDate,
    setCategory,
    setDescription,
    setError,
    setFilterType,
    setFilterCategory,
    setFilterMonth,
  } = useFilterStates.getState();

  // 2. Grab only the dynamic reactive data using concise selectors
  const { mounted, transactions } = useTransactionStore(
    useShallow((state) => ({
      mounted: state.mounted,
      transactions: state.transactions,
    })),
  );

  const {
    showSplash,
    splashFading,
    dontShowSplash,
    toastMessage,
    itemToDelete,
  } = useUiStates(
    useShallow(
      ({
        showSplash,
        splashFading,
        dontShowSplash,
        toastMessage,
        itemToDelete,
      }) => ({
        showSplash,
        splashFading,
        dontShowSplash,
        toastMessage,
        itemToDelete,
      }),
    ),
  );

  const {
    amount,
    type,
    date,
    category,
    description,
    error,
    filterType,
    filterCategory,
    filterMonth,
  } = useFilterStates(
    useShallow(
      ({
        amount,
        type,
        date,
        category,
        description,
        error,
        filterType,
        filterCategory,
        filterMonth,
      }) => ({
        amount,
        type,
        date,
        category,
        description,
        error,
        filterType,
        filterCategory,
        filterMonth,
      }),
    ),
  );

  useEffect(() => {
    const stored = localStorage.getItem('finance_data');
    if (stored) setTransactions(JSON.parse(stored));

    const hideSplash = localStorage.getItem('hide_splash');
    if (hideSplash !== 'true') setShowSplash(true);

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted)
      localStorage.setItem('finance_data', JSON.stringify(transactions));
  }, [transactions, mounted]);

  if (!mounted) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDismissSplash = () => {
    if (dontShowSplash) localStorage.setItem('hide_splash', 'true');
    setSplashFading(true);
    setTimeout(() => {
      setShowSplash(false);
      setSplashFading(false);
    }, 300);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description || !amount || !date || !category) {
      setError('Please fill out all fields.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < 0) {
      setError('Amount must be a positive number.');
      return;
    }

    const newTx: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount: numAmount,
      type,
      date,
      category,
    };

    setTransactions([newTx, ...transactions]);
    setDescription('');
    setAmount('');
    triggerToast('Item added successfully!');
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    removeTransaction(itemToDelete);
    setItemToDelete(null);
    triggerToast('Changes saved! Item deleted.');
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchType = filterType === 'All' || tx.type === filterType;
    const matchCategory =
      filterCategory === 'All' || tx.category === filterCategory;
    const matchMonth = filterMonth === 'All' || tx.date.startsWith(filterMonth);
    return matchType && matchCategory && matchMonth;
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const uniqueMonths = Array.from(
    new Set(transactions.map((tx) => tx.date.substring(0, 7))),
  );
  const uniqueCategories = Array.from(
    new Set(transactions.map((tx) => tx.category)),
  );

  return (
    <div className="min-h-screen bg-cyan-900 p-8 font-sans text-gray-900">
      {/* Splash Screen Overlay */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm text-white transition-all duration-300 ${splashFading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            Personal Finance Tracker
          </h1>
          <p className="mb-8 text-lg text-white-300">
            Take control of your financial journey.
          </p>
          <p className="mb-12 text-sm font-medium text-white-400">
            Developed by Ramil Moral
          </p>

          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleDismissSplash}
              className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-lg"
            >
              Enter Dashboard
            </button>
            <label className="flex items-center space-x-2 text-sm text-white-400 cursor-pointer group">
              <input
                type="checkbox"
                checked={dontShowSplash}
                onChange={(e) => setDontShowSplash(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-white focus:ring-slate-500 transition-all duration-300"
              />
              <span className="group-hover:text-slate-200 transition-all duration-300">
                Don't show this splash screen again
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-sm scale-100 rounded-xl bg-white p-6 shadow-xl transition-all duration-300">
            <h3 className="mb-2 text-lg font-semibold">Delete Transaction</h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to permanently delete this item?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-red-700 hover:shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-lime-700 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
      >
        {toastMessage}
      </div>

      <div className="mx-auto max-w-5xl space-y-8 relative z-10">
        <h1 className="mb-10 text-3xl text-center font-semibold text-white sm:text-4xl md:text-5xl">
          Finance Tracker
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm text-gray-500">Net Balance</p>
            <p
              className={`text-2xl font-bold transition-all duration-300 ${netBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}
            >
              ${netBalance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <form
            onSubmit={handleAddTransaction}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-1 h-fit transition-all duration-300 hover:shadow-md"
          >
            <h2 className="mb-4 text-lg font-semibold">Add Transaction</h2>

            {error && (
              <div className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600 transition-all duration-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm transition-all duration-300 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 hover:border-slate-400"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm transition-all duration-300 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 hover:border-slate-400"
              />
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as 'income' | 'expense')
                }
                className="w-full rounded-md border border-gray-300 p-2 text-sm transition-all duration-300 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 hover:border-slate-400"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm transition-all duration-300 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 hover:border-slate-400"
              />
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm transition-all duration-300 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 hover:border-slate-400"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-md active:scale-95"
              >
                Save Transaction
              </button>
            </div>
          </form>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2 transition-all duration-300 hover:shadow-md">
            <div className="mb-4 flex flex-wrap gap-4 border-b border-gray-100 pb-4">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="rounded-md border p-2 text-sm transition-all duration-300 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 hover:border-slate-400"
              >
                <option value="All">All Months</option>
                {uniqueMonths.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-md border p-2 text-sm transition-all duration-300 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 hover:border-slate-400"
              >
                <option value="All">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-md border p-2 text-sm transition-all duration-300 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 hover:border-slate-400"
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions found.</p>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="group flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tx.date} • {tx.category}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p
                        className={`font-semibold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}
                      >
                        {tx.type === 'income' ? '+' : '-'}$
                        {tx.amount.toFixed(2)}
                      </p>
                      <button
                        onClick={() => setItemToDelete(tx.id)}
                        className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-all duration-300 hover:bg-red-100 hover:text-red-600 focus:opacity-100"
                        title="Delete item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
