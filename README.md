<div align="center">

# 💜 Apoia.dev

**Plataforma de apoio financeiro para criadores de conteúdo e desenvolvedores.**  
Receba doações de forma simples, segura e com autenticação integrada.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)

</div>

---

## 📋 Sobre o projeto

O **Apoia.dev** é uma plataforma fullstack inspirada no modelo de doações para criadores, desenvolvida como projeto de aprendizado com base nas aulas do [Sujeito Programador](https://www.youtube.com/@Sujeitoprogramador) no YouTube.

O projeto cobre todo o fluxo de uma aplicação real: autenticação de usuários, integração com gateway de pagamento, persistência em banco de dados relacional e uma interface moderna e responsiva.

---

## 🚀 Tecnologias

| Tecnologia | Descrição |
|---|---|
| [Next.js](https://nextjs.org/) | Framework React fullstack com App Router |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática para JavaScript |
| [TailwindCSS](https://tailwindcss.com/) | Estilização utility-first |
| [TanStack Query](https://tanstack.com/query) | Gerenciamento de estado e requisições assíncronas |
| [Auth.js](https://authjs.dev/) | Autenticação segura de usuários |
| [Stripe](https://stripe.com/) | Integração de pagamentos online |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [Prisma](https://www.prisma.io/) | ORM para Node.js e TypeScript |

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Uma instância do [PostgreSQL](https://www.postgresql.org/) rodando localmente ou na nuvem
- Uma conta no [Stripe](https://stripe.com/) (modo teste)

---

## 🛠️ Instalação e configuração

### 1. Clone o repositório

```bash
git clone https://github.com/RondneyLoiola/apoia-dev.git
cd apoia-dev
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Abra o `.env` e configure:

```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/apoia_dev"

# Auth.js
NEXTAUTH_SECRET="sua_chave_secreta"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 4. Execute as migrations do banco de dados

```bash
npx prisma migrate dev
```

### 5. (Opcional) Popule o banco com dados de exemplo

```bash
npx prisma db seed
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 💳 Testando pagamentos com Stripe

Para testar o fluxo de doações, use os cartões de teste do Stripe:

| Cartão | Número | Resultado |
|---|---|---|
| Sucesso | `4242 4242 4242 4242` | Pagamento aprovado |
| Recusado | `4000 0000 0000 0002` | Pagamento recusado |

Use qualquer data futura como validade e qualquer CVC de 3 dígitos.

Para receber os eventos do Stripe localmente, instale o [Stripe CLI](https://stripe.com/docs/stripe-cli) e rode:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📁 Estrutura do projeto

```
apoia-dev/
├── prisma/
│   ├── schema.prisma       # Modelos do banco de dados
│   └── seed.ts             # Dados iniciais para desenvolvimento
├── public/                 # Arquivos estáticos
├── src/
│   ├── app/                # Rotas e páginas (App Router)
│   ├── components/         # Componentes reutilizáveis
│   ├── lib/                # Configurações (auth, stripe, prisma)
│   └── services/           # Lógica de negócio e chamadas à API
├── types/                  # Tipos TypeScript globais
├── .env.example
└── README.md
```

---

## 📜 Scripts disponíveis

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Gera o build de produção
npm run start     # Inicia o servidor em produção
npm run lint      # Verifica erros de lint
```

---

## 🤝 Créditos

Projeto desenvolvido com base nas aulas do canal **[Sujeito Programador](https://www.youtube.com/@Sujeitoprogramador)** no YouTube.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  Feito com 💜 por <a href="https://github.com/RondneyLoiola">Rondney Loiola</a>
</div>
