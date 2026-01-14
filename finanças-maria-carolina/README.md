# 💰 Gestão Financeira - Maria Carolina

Aplicativo de gestão financeira pessoal desenvolvido com React, TypeScript e Vite, integrado com Google Gemini AI.

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js)
- **Chave de API do Google Gemini** ([obtenha aqui](https://aistudio.google.com/apikey))

## 🚀 Como Executar Localmente

### 1. Clone o Repositório

```bash
git clone https://github.com/KaiqueOliveira27/Gest-o-Financeira-M.git
cd Gest-o-Financeira-M/finanças-maria-carolina
```

### 2. Instale as Dependências

```bash
npm install
```

> ⚠️ **Importante**: A pasta `node_modules` não está no GitHub (isso é correto!). Você DEVE executar `npm install` para baixar todas as dependências necessárias.

### 3. Configure a Chave de API

1. Copie o arquivo `.env.example` e renomeie para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Abra o arquivo `.env.local` e adicione sua chave de API do Gemini:
   ```
   VITE_GEMINI_API_KEY=sua_chave_api_aqui
   ```

3. Obtenha sua chave de API em: https://aistudio.google.com/apikey

### 4. Execute o Projeto

```bash
npm run dev
```

O aplicativo estará disponível em: **http://localhost:5173**

## 📦 Dependências Principais

- **React 19** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Google Gemini AI** - Inteligência artificial
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run preview` - Visualiza a build de produção

## 📁 Estrutura do Projeto

```
finanças-maria-carolina/
├── components/          # Componentes React
│   ├── FinancialForm.tsx
│   └── PorquinhoCard.tsx
├── services/           # Serviços e integrações
│   ├── financeService.ts
│   └── geminiService.ts
├── App.tsx            # Componente principal
├── index.tsx          # Ponto de entrada
├── types.ts           # Definições de tipos TypeScript
└── package.json       # Dependências e scripts
```

## ❓ Solução de Problemas

### Erro 404 ou página em branco?
- ✅ Verifique se executou `npm install`
- ✅ Verifique se criou o arquivo `.env.local` com a chave de API
- ✅ Verifique se está na pasta correta (`finanças-maria-carolina/`)

### Dependências não instaladas?
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente no seu serviço de hosting
2. Execute o build:
   ```bash
   npm run build
   ```
3. A pasta `dist/` conterá os arquivos para deploy

## 📝 Licença

Este projeto é privado e destinado ao uso pessoal.

---

**Desenvolvido por**: KaiqueOliveira27

