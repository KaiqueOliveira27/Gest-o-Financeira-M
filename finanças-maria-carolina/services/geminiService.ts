import { GoogleGenAI } from "@google/genai";
import { MonthlyData } from "../types";

const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getFinancialAdvice = async (data: MonthlyData[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Configuração de API necessária para obter conselhos.";

  // Format data for the prompt
  const dataSummary = data.slice(-6).map(d =>
    `Mês: ${d.month}, Entrada: R$${d.income}, Saída: R$${d.expenses}, Guardado: R$${d.savingsBalance}`
  ).join('\n');

  const prompt = `
    Você é um consultor financeiro pessoal para a Maria Carolina.
    Analise os dados financeiros dos últimos meses abaixo e dê um feedback curto, encorajador e prático (máximo 3 parágrafos).
    
    Dados:
    ${dataSummary}
    
    Foque em:
    1. A evolução do dinheiro guardado (Investimentos).
    2. Se os gastos estão compatíveis com a entrada.
    3. Sugira uma meta para o "Porquinho do Inter" (CDB).
    
    Use um tom amigável e direto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return "Ocorreu um erro ao conectar com a inteligência financeira.";
  }
};