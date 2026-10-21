# Currículos — API Express + MongoDB + React Native

Aplicação para **cadastrar, consultar, alterar, excluir e pesquisar currículos**, baseada no
template [AtividadeTemplate](https://github.com/Emerson-Rocha/AtividadeTemplate)
(Expo + React Native Paper + React Navigation Drawer/Stack).

```
curriculos/
├── backend/   API REST (Express + MongoDB/Mongoose + JWT)
└── app/       App React Native (Expo)
```

## Requisitos da atividade × onde está implementado

| Requisito | Implementação |
|---|---|
| Cadastro de usuário | `Cadastro.jsx` → `POST /api/auth/cadastro` (senha com bcrypt) |
| Login (só autenticados acessam a área do usuário) | `Login.jsx` → `POST /api/auth/login` (JWT); `MinhaConta.js` e `FormCurriculo.js` bloqueiam quem não está logado; rotas de escrita da API exigem token. Após login/cadastro o app abre em **Meu perfil** |
| Nome do usuário no menu | `CabecaMenu.js` (cabeçalho do menu lateral) |
| Meu perfil (dados da conta + gerenciar conteúdo) | `MinhaConta.js` (dados editáveis do usuário e lista “meus currículos”) + `FormCurriculo.js` (novo/editar) |
| Gerenciamento de imagens (editar / excluir quando autenticado) | `Cards.js`: botões **Editar** e **Excluir** só aparecem para o usuário logado dono do currículo; `FormCurriculo.js` permite trocar/remover a foto |
| Não autenticados só visualizam | Home, Pesquisa e Detalhe são públicos e sem botões de edição/exclusão |
| Pesquisa por termo | `Pesquisa.js` → `GET /api/curriculos?busca=termo` (nome, cargo, cidade, resumo, habilidades, empresas, cursos) |
| Novas telas | `Detalhe.js`, `FormCurriculo.js`, `Acesso.js`, `MinhaConta.js` |

## Como rodar

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # ajuste MONGO_URI e JWT_SECRET
npm start                # http://localhost:3000
```

É preciso ter o MongoDB rodando localmente **ou** uma string de conexão do
[MongoDB Atlas](https://www.mongodb.com/atlas) (grátis) em `MONGO_URI`.

### 2. App

```bash
cd app
npm install
npx expo start           # tecla "w" abre no navegador, "a" no Android
```

Edite `app/config.js` conforme onde for testar:

- Navegador / simulador iOS: já funciona (`localhost`)
- Emulador Android: já funciona (`10.0.2.2`)
- **Celular físico (Expo Go):** coloque o IP do seu PC em `IP_DO_PC` (ex.: `'192.168.0.15'`),
  com celular e PC na mesma rede Wi-Fi.

## Endpoints da API

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/auth/cadastro` | público | cria usuário e já devolve o token |
| POST | `/api/auth/login` | público | autentica e devolve o token |
| GET | `/api/auth/me` | token | dados do usuário logado |
| PUT | `/api/auth/me` | token | edita nome, e-mail e (opcional) senha — `novaSenha` exige `senhaAtual` |
| GET | `/api/curriculos?busca=` | público | lista / pesquisa currículos |
| GET | `/api/curriculos/:id` | público | detalhe de um currículo |
| GET | `/api/curriculos/meus` | token | currículos do usuário logado |
| POST | `/api/curriculos` | token | cria currículo |
| PUT | `/api/curriculos/:id` | token (dono) | edita currículo |
| DELETE | `/api/curriculos/:id` | token (dono) | exclui currículo |

Header de autenticação: `Authorization: Bearer <token>`.

## Publicar no GitHub

```bash
cd curriculos
git init
git add .
git commit -m "Atividade prática: API de currículos + React Native"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

(`.gitignore` já exclui `node_modules` e `.env`.)

## Observações

- A foto é enviada em base64 e guardada no próprio documento do MongoDB (simples para a atividade;
  em produção o ideal seria um storage de arquivos).
- O token JWT fica salvo com AsyncStorage, então o login persiste ao fechar o app.
