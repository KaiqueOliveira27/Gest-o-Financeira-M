# Configuração do Supabase

Este guia mostra como configurar o Supabase para o projeto de Gestão Financeira.

## 1. Criar Conta e Projeto no Supabase

### Passo 1: Criar Conta
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou email

### Passo 2: Criar Novo Projeto
1. No dashboard, clique em "New Project"
2. Preencha:
   - **Name**: `financas-maria-carolina`
   - **Database Password**: Crie uma senha forte (salve em local seguro!)
   - **Region**: Escolha `South America (São Paulo)` para melhor performance
   - **Pricing Plan**: Free (suficiente para este projeto)
3. Clique em "Create new project"
4. Aguarde 2-3 minutos enquanto o projeto é criado

## 2. Executar Migration SQL

### Passo 1: Acessar SQL Editor
1. No menu lateral, clique em "SQL Editor"
2. Clique em "New query"

### Passo 2: Copiar e Executar SQL
1. Abra o arquivo: `supabase/migrations/001_create_monthly_data.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em "Run" ou pressione `Ctrl+Enter`
5. Você deve ver a mensagem "Success. No rows returned"

### Passo 3: Verificar Tabela
1. No menu lateral, clique em "Table Editor"
2. Você deve ver a tabela `monthly_data` listada
3. Clique nela para ver a estrutura

## 3. Obter Credenciais da API

### Passo 1: Acessar Configurações
1. No menu lateral, clique no ícone de engrenagem (Settings)
2. Clique em "API"

### Passo 2: Copiar Credenciais
Você verá duas informações importantes:

**Project URL:**
```
https://seu-projeto-id.supabase.co
```

**anon public (API Key):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: Copie ambos! Você precisará deles no próximo passo.

## 4. Configurar Variáveis de Ambiente

### Passo 1: Criar arquivo .env.local
1. Na pasta do projeto, copie o arquivo `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

### Passo 2: Adicionar Credenciais
Abra o arquivo `.env.local` e preencha:

```env
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui

# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Testar a Conexão

### Passo 1: Reiniciar o Servidor
```bash
# Pare o servidor (Ctrl+C) se estiver rodando
npm run dev
```

### Passo 2: Verificar Console
1. Abra o navegador em `http://localhost:5173`
2. Abra o Console do Desenvolvedor (F12)
3. Não deve haver erros de conexão com Supabase

### Passo 3: Testar CRUD
1. Adicione um novo mês com receitas e despesas
2. Vá para o Supabase Dashboard → Table Editor → monthly_data
3. Você deve ver os dados aparecendo na tabela!

## 6. Configurar Autenticação (Opcional)

Se quiser adicionar login de usuários:

### Passo 1: Habilitar Email Auth
1. No Supabase Dashboard, vá em "Authentication" → "Providers"
2. Habilite "Email"
3. Configure as opções conforme necessário

### Passo 2: Adicionar Componente de Login
O código já está preparado para autenticação. Você pode adicionar um componente de login posteriormente.

## 7. Recursos Úteis

- **Dashboard**: https://supabase.com/dashboard
- **Documentação**: https://supabase.com/docs
- **Table Editor**: Para visualizar e editar dados manualmente
- **SQL Editor**: Para executar queries SQL
- **Logs**: Para debug de problemas

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou a chave `anon public` corretamente
- Certifique-se de que não há espaços extras

### Erro: "Failed to fetch"
- Verifique se a URL do projeto está correta
- Verifique sua conexão com a internet
- Confirme que o projeto Supabase está ativo

### Dados não aparecem
- Verifique se executou a migration SQL
- Confirme que a tabela `monthly_data` existe
- Verifique as políticas RLS no Table Editor

### RLS bloqueando acesso
- Certifique-se de que está autenticado (se usando auth)
- Verifique as políticas RLS na tabela
- Para testes, você pode desabilitar RLS temporariamente (não recomendado em produção)

## Próximos Passos

Após configurar o Supabase:
1. ✅ Dados serão salvos automaticamente na nuvem
2. ✅ Acesse de qualquer dispositivo
3. ✅ Backup automático
4. ✅ Sincronização em tempo real (se implementado)

---

**Precisa de ajuda?** Consulte a [documentação oficial do Supabase](https://supabase.com/docs) ou me pergunte!
