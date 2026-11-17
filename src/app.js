import { state } from "./state.js";
import { $, esc } from "./utils.js";
import { aoMudarSessao, carregarPerfil } from "./models/AuthModel.js";
import { formulario } from "./views/AuthView.js";
import { layout } from "./views/LayoutView.js";
import * as Auth from "./controllers/AuthController.js";
import * as Ag from "./controllers/AgendamentoController.js";
import * as Pro from "./controllers/ProfissionalController.js";
import * as Cli from "./controllers/ClienteController.js";
import * as Perfil from "./controllers/PerfilController.js";

const telas = { ...Pro.telas, ...Cli.telas, ...Perfil.telas };
const acoes = {
  ...Auth.acoes, ...Ag.acoes, ...Pro.acoes, ...Cli.acoes, ...Perfil.acoes,
  aba: el => { state.tab = el.dataset.tab; state.sel = {}; state.render(); }
};
const TABS = {
  profissional: [["agenda", "Agenda"], ["servicos", "Serviços"], ["config", "Disponibilidade"], ["perfil", "Perfil"]],
  cliente: [["agendar", "Agendar"], ["meus", "Meus horários"], ["perfil", "Perfil"]]
};

state.render = async () => {
  const app = $("#app"), me = state.me;
  if (!me) { app.innerHTML = formulario(state.modo); return; }
  const tabs = TABS[me.role];
  if (!tabs.some(t => t[0] === state.tab)) state.tab = me.role === "cliente" && state.pid ? "agendar" : tabs[0][0];
  app.innerHTML = layout(me, tabs, state.tab);
  try { $("#body").innerHTML = await telas[state.tab](); }
  catch (e) { $("#body").innerHTML = `<p class="err">${esc(e.message)}</p>`; }
};

// um único listener de cliques: o data-act de cada botão escolhe a ação do controller
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]");
  if (!el || !acoes[el.dataset.act]) return;
  try { await acoes[el.dataset.act](el); } catch (err) { alert(err.message); }
});

aoMudarSessao(async s => { state.me = s ? await carregarPerfil(s.user.id) : null; state.render(); });
