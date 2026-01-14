import React from 'react';
import { Trash2, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { MonthlyData } from '../types';
import { formatCurrency } from '../services/financeService';

interface Props {
    data: MonthlyData[];
    onDelete: (id: string) => void;
}

export const MonthlyDataList: React.FC<Props> = ({ data, onDelete }) => {
    if (data.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registros Mensais</h3>
            <div className="space-y-3">
                {data.map((item) => {
                    const balance = item.income - item.expenses;
                    const isPositive = balance >= 0;

                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">
                                        {new Date(item.month + '-01').toLocaleDateString('pt-BR', {
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                    <div className="flex gap-4 mt-1 text-sm">
                                        <span className="text-green-600 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {formatCurrency(item.income)}
                                        </span>
                                        <span className="text-red-600 flex items-center gap-1">
                                            <TrendingDown className="w-3 h-3" />
                                            {formatCurrency(item.expenses)}
                                        </span>
                                        <span className={`font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            Saldo: {formatCurrency(balance)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Guardado</p>
                                    <p className="text-lg font-bold text-indigo-600">
                                        {formatCurrency(item.savingsBalance)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir registro"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
