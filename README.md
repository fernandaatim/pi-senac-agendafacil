# AgendaFácil

Sistema web de agendamento para profissionais autônomos (manicures, barbeiros, lash designers etc.).
Front-end em HTML, CSS e JavaScript (módulos ES) seguindo o padrão **MVC**. Back-end com **Supabase** (PostgreSQL + autenticação), publicado na **Vercel**.

## Arquitetura MVC

| Camada | Pasta | Responsabilidade |
|---|---|---|
| **Model** | `js/models/` | Acesso ao banco (Supabase) e regras de negócio. Não conhece HTML. |
| **View** | `js/views/` | Funções que recebem dados e devolvem HTML. Não acessam o banco. |
| **Controller** | `js/controllers/` | Recebem os cliques, chamam os Models e escolhem a View a exibir. |

```
agendafacil/
├── index.html            página única (carrega o CSS e o app.js)
├── schema.sql            tabelas, regras de segurança (RLS) e limite de horário
├── css/style.css
└── js/
    ├── app.js            ponto de entrada: roteia telas e cliques para os controllers
    ├── config.js         URL e chave do Supabase
    ├── state.js          estado (usuário logado, aba atual, seleções)
    ├── utils.js          funções auxiliares (datas, moeda, escape de HTML)
    ├── models/           db, AuthModel, PerfilModel, ServicoModel, AgendamentoModel, Horarios
    ├── views/            comum, profissional, cliente
    └── controllers/      Auth, Agendamento, Profissional, Cliente, Perfil
```

**Fluxo de uma ação** (ex.: cliente confirma um horário):
1. A View desenha `<button data-act="reservar">`.
2. O `app.js` escuta o clique e chama `acoes.reservar` no `ClienteController`.
3. O Controller pede ao `Horarios.js` o intervalo e ao `AgendamentoModel.criar` que grave no banco.
4. O banco aceita ou recusa (se o horário já estiver ocupado).
5. O Controller chama `state.render()`, que pede a tela atualizada às Views.

## Como foi construído (passo a passo)

1. **Levantamento (Projeto Integrador, fase 1):** problema, público-alvo, stakeholders, personas (Camila e o cliente final) e jornadas. Dali saíram os requisitos: cadastro de serviços, disponibilidade, página de agendamento pelo celular, painel do profissional e histórico.
2. **Escolha da stack:** a Vercel hospeda sites estáticos de graça e não roda PHP. Por isso: front-end estático + Supabase como back-end pronto (banco PostgreSQL, login e API), sem servidor próprio.
3. **Modelagem do banco** (`schema.sql`): três tabelas.
   - `profiles` (usuário, com `role` = profissional ou cliente, e a disponibilidade do profissional);
   - `servicos` (nome, duração, preço, profissional);
   - `agendamentos` (profissional, cliente, serviço, início, fim, status).
4. **Login e perfis:** o Supabase Auth guarda e-mail e senha. Um *trigger* cria o perfil automaticamente no cadastro, com o tipo escolhido.
5. **Segurança (RLS):** regras no banco definem quem lê e altera o quê. O cliente só vê os próprios agendamentos; o profissional vê os dele; só o dono edita seus serviços. Uma função `ocupados()` entrega só os horários ocupados, sem expor dados de outros clientes.
6. **Limite de horário:** uma *exclusion constraint* (`btree_gist` + `tsrange`) recusa agendamentos que se sobrepõem para o mesmo profissional. A garantia fica no banco, então vale mesmo com dois acessos ao mesmo tempo. O front-end também esconde os horários ocupados para melhorar a experiência.
7. **Camada Model:** um arquivo por entidade, todos chamando o Supabase. `Horarios.js` guarda a regra de calcular horários livres (considera duração do serviço, almoço e horários já ocupados).
8. **Camada View:** funções que montam o HTML de cada tela, com botões marcados por `data-act`.
9. **Camada Controller:** um controller por assunto (login, agendamentos, profissional, cliente, perfil). O `app.js` junta todas as ações e usa um único ouvinte de cliques.
10. **CRUD completo:**
    - serviços: criar, listar, editar, excluir;
    - agendamentos: criar, listar, cancelar, excluir;
    - perfil: ler e atualizar.
11. **Publicação:** projeto no Supabase, `schema.sql` no SQL Editor, URL e chave em `js/config.js`, repositório no GitHub e deploy na Vercel.

## Como rodar

1. Crie um projeto em supabase.com e rode o `schema.sql` no **SQL Editor**.
2. Em **Authentication → Providers → Email**, desligue **Confirm email** (para a demonstração).
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key** para `js/config.js`.
4. Para testar local: `python3 -m http.server 8000` na pasta do projeto e abra `http://localhost:8000` (módulos ES não funcionam abrindo o arquivo direto).
5. Para publicar: suba a pasta no GitHub, em vercel.com clique em **Add New → Project**, escolha o repositório e **Deploy**.

## Limitações conhecidas

- Lembretes por e-mail e sincronização com o Google Agenda ainda não foram implementados.
- Não há remarcação: cancele e agende outro horário.
