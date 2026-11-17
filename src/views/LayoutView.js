// Casca da aplicação: saudação, botão Sair e abas
import { esc } from "../utils.js";
import { chip } from "./ComponentesView.js";

export const layout = (me, tabs, tab) => `<div class="row sp"><span class="mut">Olá, <b>${esc(me.nome)}</b> (${me.role})</span>
  <button class="sec sm" data-act="sair">Sair</button></div>
  <div class="chips">${tabs.map(t => chip(tab === t[0], "aba", `data-tab="${t[0]}"`, t[1])).join("")}</div><div id="body"></div>`;
