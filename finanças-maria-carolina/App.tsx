import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
  MoreHorizontal
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MonthlyData } from './types';
import { formatCurrency, sortFinancialData } from './services/financeService';
import { DataService } from './services/dataService';
import { PorquinhoCard } from './components/PorquinhoCard';
import { FinancialForm } from './components/FinancialForm';
import { MonthlyDataList } from './components/MonthlyDataList';

function App() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Load data from Supabase/localStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const monthlyData = await DataService.getMonthlyData();
      setData(monthlyData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Derived state for dashboard
  const sortedData = useMemo(() => sortFinancialData(data), [data]);
  const currentMonthData = sortedData[sortedData.length - 1] || { income: 0, expenses: 0, savingsBalance: 0 };
  const lastMonthSavings = sortedData.length > 1 ? sortedData[sortedData.length - 2].savingsBalance : 0;
  const savingsGrowth = currentMonthData.savingsBalance - lastMonthSavings;

  const handleSaveData = async (newData: MonthlyData) => {
    try {
      await DataService.saveMonthlyData(newData);
      await loadData(); // Reload data from database
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    }
  };

  const handleDeleteData = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }

    try {
      await DataService.deleteMonthlyData(id);
      await loadData(); // Reload data from database
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Erro ao excluir dados. Tente novamente.');
    }
  };


  // Ensure charts have enough height on mobile
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Wallet className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              Olá, <span className="text-indigo-600">Maria Carolina</span>
            </h1>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Guardado</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(currentMonthData.savingsBalance)}</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="text-sm">
              <span className={savingsGrowth >= 0 ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                {savingsGrowth >= 0 ? "+" : ""}{formatCurrency(savingsGrowth)}
              </span>
              <span className="text-gray-400 ml-1">em relação ao mês anterior</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Entradas (Este Mês)</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(currentMonthData.income)}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <ArrowUpCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div className="bg-blue-500 h-1.5 rounded-full w-full"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Saídas (Este Mês)</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(currentMonthData.expenses)}</h3>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <ArrowDownCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Saldo do mês: </span>
              <span className={`font-bold ${(currentMonthData.income - currentMonthData.expenses) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(currentMonthData.income - currentMonthData.expenses)}
              </span>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <section>
          <FinancialForm onSave={handleSaveData} />
        </section>

        {/* Monthly Data List */}
        <section>
          <MonthlyDataList data={sortedData} onDelete={handleDeleteData} />
        </section>

        {/* Charts Section */}
        {sortedData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Evolução Patrimonial</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickFormatter={(value) => `R$${value / 1000}k`}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="savingsBalance"
                      name="Dinheiro Guardado"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ fill: '#059669', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Entradas vs Saídas</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <RechartsTooltip
                      formatter={(value: number) => formatCurrency(value)}
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Entrada" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="expenses" name="Saída" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Comece a registrar</h3>
            <p className="text-gray-500 mt-2">Adicione seu primeiro mês acima para ver os gráficos de evolução.</p>
          </div>
        )}

        {/* Porquinho Special Section */}
        <section>
          <PorquinhoCard currentSaved={currentMonthData.savingsBalance} />
        </section>

      </main>
    </div>
  );
}

export default App;