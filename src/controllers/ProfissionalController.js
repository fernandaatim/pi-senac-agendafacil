import { state } from "../state.js";
import { $, nowIso, toast, confirmar } from "../utils.js";
import * as Ag from "../models/AgendamentoModel.js";
import * as Sv from "../models/ServicoModel.js";
import * as Pf from "../models/PerfilModel.js";
import * as V from "../views/ProfissionalView.js";

export const telas = {
  agenda: async () => V.agenda(await Ag.doProfissional(state.me.id), location.origin + location.pathname + "?p=" + state.me.id, nowIso()),
  servicos: async () => V.servicos(await Sv.listar(state.me.id), state.sel.edit),
  config: () => { state.sel.dias ??= [...(state.me.dias || [])]; return V.config(state.me, state.sel.dias); }
};

export const acoes = {
  salvarServico: async el => {
    const nome = $("#sn").value.trim(), dur = +$("#sd").value;
    if (!nome || !dur) return toast("Informe nome e duração.", "erro");
    const dados = { nome, dur, preco: +$("#sp").value || 0, descricao: $("#sx").value.trim() || null };
    const id = +el.dataset.id;
    if (id) await Sv.atualizar(id, dados);
    else await Sv.criar({ ...dados, prof_id: state.me.id });
    toast(id ? "Serviço atualizado." : "Serviço adicionado.");
    state.sel.edit = null;
    state.render();
  },
  editarServico: async el => {
    state.sel.edit = +el.dataset.id;
    await state.render();
    $("#form-servico")?.scrollIntoView({ behavior: "smooth", block: "center" });
  },
  cancelarEdicao: () => { state.sel.edit = null; state.render(); },
  excluirServico: async el => {
    const sim = await confirmar({
      titulo: "Excluir serviço?",
      texto: "Os agendamentos já feitos continuam no histórico, mas sem o nome do serviço.",
      ok: "Excluir",
      cancelar: "Voltar",
      perigo: true
    });
    if (!sim) return;
    await Sv.excluir(+el.dataset.id);
    state.sel.edit = null;
    toast("Serviço excluído.");
    state.render();
  },
  alternarDia: el => {
    const i = +el.dataset.dia, d = state.sel.dias;
    state.sel.dias = d.includes(i) ? d.filter(x => x !== i) : [...d, i];
    state.render();
  },
  salvarConfig: async () => {
    const u = { dias: state.sel.dias, ini: $("#hi").value || "09:00", fim: $("#hf").value || "18:00", alm: $("#ha").value || "" };
    await Pf.atualizar(state.me.id, u); Object.assign(state.me, u); toast("Disponibilidade salva.");
  },
  copiarLink: async el => { await navigator.clipboard.writeText(el.dataset.link); toast("Link copiado"); }
};