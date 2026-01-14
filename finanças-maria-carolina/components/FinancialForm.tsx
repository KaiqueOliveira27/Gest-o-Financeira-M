import React, { useState } from 'react';
import { PlusCircle, Save } from 'lucide-react';
import { MonthlyData } from '../types';

interface Props {
  onSave: (data: MonthlyData) => Promise<void>;
  existingData?: MonthlyData;
}

export const FinancialForm: React.FC<Props> = ({ onSave }) => {
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [income, setIncome] = useState<string>('');
  const [expenses, setExpenses] = useState<string>('');
  const [savings, setSavings] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!month) return;

    setIsSaving(true);
    try {
      const data: MonthlyData = {
        id: month,
        month,
        income: parseFloat(income) || 0,
        expenses: parseFloat(expenses) || 0,
        savingsBalance: parseFloat(savings) || 0,
      };

      await onSave(data);

      // Reset inputs to clean state
      setIncome('');
      setExpenses('');
      setSavings('');
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-indigo-500" />
        Novo Registro Mensal
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Mês de Referência</label>
          <input
            type="month"
            required
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Quanto Entrou (R$)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Quanto Saiu (R$)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Total Guardado (R$)</label>
          <input
            type="number"
            step="0.01"
            placeholder="Total no Porquinho"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 md:col-span-2 lg:col-span-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Salvando...' : 'Salvar Dados do Mês'}
        </button>
      </form>
    </div>
  );
};