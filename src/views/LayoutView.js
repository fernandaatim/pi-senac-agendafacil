import { esc } from "../utils.js";
import { chip } from "./ComponentesView.js";

export const usuario = me => `<span class="nome">Olá, <b>${esc(me.nome)}</b></span>
  <button class="sair" data-act="sair"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>Sair</button>`;

export const layout = (tabs, tab) => `<div class="chips tabs" id="tabs">${tabs.map(t => chip(tab === t[0], "aba", `data-tab="${t[0]}"`, t[1])).join("")}</div><div id="body"></div>`;