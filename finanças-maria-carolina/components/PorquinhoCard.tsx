import React, { useState, useEffect } from 'react';
import { PiggyBank, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency, simulatePorquinho, getMonthlyCDIRate } from '../services/financeService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const PorquinhoCard: React.FC<{ currentSaved: number }> = ({ currentSaved }) => {
  const [contribution, setContribution] = useState<number>(0);
  const [months, setMonths] = useState<number>(12);
  const [simulationData, setSimulationData] = useState<any[]>([]);

  useEffect(() => {
    const data = simulatePorquinho(currentSaved, contribution, months);
    setSimulationData(data);
  }, [currentSaved, contribution, months]);

  const monthlyRatePercent = (getMonthlyCDIRate() * 100).toFixed(2);
  const projectedTotal = simulationData.length > 0 ? simulationData[simulationData.length - 1].amount : 0;
  const totalYield = projectedTotal - (currentSaved + (contribution * months));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PiggyBank className="w-6 h-6" />
          <h2 className="font-bold text-lg">Porquinho (Banco Inter)</h2>
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">CDI ~{monthlyRatePercent}% a.m.</span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Você já tem guardado</label>
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(currentSaved)}</div>
            <p className="text-xs text-gray-400">Atualizado automaticamente pelos seus registros.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Quanto quer guardar por mês?</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="number" 
                  value={contribution}
                  onChange={(e) => setContribution(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="50"
                value={contribution}
                onChange={(e) => setContribution(Number(e.target.value))}
                className="w-full mt-2 accent-orange-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Por quanto tempo? ({months} meses)</label>
              <input 
                type="range" 
                min="1" 
                max="60" 
                step="1"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-orange-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-orange-50 rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-orange-800 font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Projeção de Futuro
            </h3>
            <p className="text-sm text-orange-600/80 mb-4">
              Considerando 100% do CDI atual.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">Total Acumulado</p>
                    <p className="text-lg font-bold text-orange-600">{formatCurrency(projectedTotal)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">Só Rendimentos</p>
                    <p className="text-lg font-bold text-green-600">+{formatCurrency(totalYield)}</p>
                </div>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulationData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Mês ${label}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#f97316" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};