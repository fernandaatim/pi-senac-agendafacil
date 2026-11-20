import { state } from "./state.js";
import { $, esc, toast, traduzir, REGRAS_SENHA } from "./utils.js";
import { aoMudarSessao, carregarPerfil } from "./models/AuthModel.js";
import { formulario } from "./views/AuthView.js";
import { layout, usuario } from "./views/LayoutView.js";
import * as Auth from "./controllers/AuthController.js";
import * as Ag from "./controllers/AgendamentoController.js";
import * as Pro from "./controllers/ProfissionalController.js";
import * as Cli from "./controllers/ClienteController.js";
import * as Perfil from "./controllers/PerfilController.js";

const telas = { ...Pro.telas, ...Cli.telas, ...Perfil.telas };
const acoes = {
  ...Auth.acoes, ...Ag.acoes, ...Pro.acoes, ...Cli.acoes, ...Perfil.acoes,
  aba: el => { state.tab = el.dataset.tab; state.sel = {}; state.cache = {}; state.render(); }
};
const TABS = {
  profissional: [["agenda", "Agenda"], ["servicos", "Serviços"], ["config", "Disponibilidade"], ["perfil", "Perfil"]],
  cliente: [["agendar", "Agendar"], ["meus", "Meus horários"], ["perfil", "Perfil"]]
};
const esqueleto = `<div class="skel h"></div><div class="skel"></div><div class="skel"></div>`;

let telaAtual = "", usuarioAtual = null, chamada = 0;

state.render = async () => {
  const app = $("#app"), me = state.me, id = ++chamada;
  $("#user").innerHTML = me ? usuario(me) : "";
  if (!me) {
    usuarioAtual = null;
    telaAtual = "";
    app.innerHTML = formulario(state.modo);
    return;
  }
  const tabs = TABS[me.role];
  if (!tabs.some(t => t[0] === state.tab)) state.tab = me.role === "cliente" && state.pid ? "agendar" : tabs[0][0];
  if (me.role === "profissional" && !me.endereco) state.tab = "perfil";
  if (usuarioAtual !== me.id || !$("#body")) {
    app.innerHTML = layout(tabs, state.tab);
    usuarioAtual = me.id;
    telaAtual = "";
  }
  document.querySelectorAll("#tabs .chip").forEach(c => c.classList.toggle("on", c.dataset.tab === state.tab));
  const corpo = $("#body"), trocou = telaAtual !== state.tab;
  telaAtual = state.tab;
  if (trocou) corpo.innerHTML = esqueleto;
  else corpo.classList.add("busy");
  let html;
  try { html = await telas[state.tab](); }
  catch (e) { html = `<p class="err">${esc(traduzir(e.message))}</p>`; }
  if (id !== chamada) return;
  corpo.innerHTML = html;
  corpo.classList.remove("busy");
  if (trocou) {
    corpo.classList.remove("fade");
    void corpo.offsetWidth;
    corpo.classList.add("fade");
  }
};

const executar = async (acao, el) => {
  try { await acoes[acao]?.(el); } catch (err) { toast(traduzir(err.message), "erro"); }
};

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (el) executar(el.dataset.act, el);
});

document.addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  if (f.dataset.submit) executar(f.dataset.submit, f.querySelector(".big"));
});

document.addEventListener("input", e => {
  if (e.target.id === "obs") { state.sel.obs = e.target.value; return; }
  if (e.target.id !== "a-s") return;
  const lista = $("#regras");
  if (!lista) return;
  lista.querySelectorAll("li").forEach(li => li.classList.toggle("ok", REGRAS_SENHA[li.dataset.r](e.target.value)));
});

aoMudarSessao(async (s, ev) => {
  if (ev === "PASSWORD_RECOVERY") state.modo = "novasenha";
  if (state.modo === "novasenha") { state.me = null; state.render(); return; }
  const perfil = s ? await carregarPerfil(s.user.id) : null;
  if ((perfil?.id ?? null) !== (state.me?.id ?? null)) { state.tab = ""; state.sel = {}; state.cache = {}; }
  state.me = perfil;
  if (!s) state.modo = "entrar";
  state.render();
});