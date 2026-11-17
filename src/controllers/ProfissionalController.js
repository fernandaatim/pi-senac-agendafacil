import { state } from "../state.js";
import { $, nowIso } from "../utils.js";
import * as Ag from "../models/AgendamentoModel.js";
import * as Sv from "../models/ServicoModel.js";
import * as Pf from "../models/PerfilModel.js";
import * as V from "../views/ProfissionalView.js";

export const telas = {
  agenda: async () => V.agenda(await Ag.doProfissional(state.me.id), location.origin + location.pathname + "?p=" + state.me.id, nowIso()),
  servicos: async () => V.servicos(await Sv.listar(state.me.id)),
  config: () => { state.sel.dias ??= [...(state.me.dias || [])]; return V.config(state.me, state.sel.dias); }
};

export const acoes = {
  addServico: async () => {
    const nome = $("#sn").value.trim(), dur = +$("#sd").value;
    if (!nome || !dur) return alert("Informe nome e duração.");
    await Sv.criar({ prof_id: state.me.id, nome, dur, preco: +$("#sp").value || 0 });
    state.render();
  },
  editarServico: async el => {
    const d = el.dataset, nome = prompt("Nome do serviço", d.nome);
    if (!nome) return;
    const dur = +prompt("Duração (min)", d.dur);
    if (!dur) return;
    await Sv.atualizar(+d.id, { nome, dur, preco: +prompt("Preço (R$)", d.preco) || 0 });
    state.render();
  },
  excluirServico: async el => { if (!confirm("Excluir este serviço?")) return; await Sv.excluir(+el.dataset.id); state.render(); },
  alternarDia: el => {
    const i = +el.dataset.dia, d = state.sel.dias;
    state.sel.dias = d.includes(i) ? d.filter(x => x !== i) : [...d, i];
    state.render();
  },
  salvarConfig: async () => {
    const u = { dias: state.sel.dias, ini: $("#hi").value || "09:00", fim: $("#hf").value || "18:00", alm: $("#ha").value || "" };
    await Pf.atualizar(state.me.id, u); Object.assign(state.me, u); alert("Disponibilidade salva.");
  },
  copiarLink: async el => { await navigator.clipboard.writeText(el.dataset.link); alert("Link copiado"); }
};
