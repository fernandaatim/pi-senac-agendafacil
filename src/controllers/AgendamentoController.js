import { state } from "../state.js";
import { confirmar, toast } from "../utils.js";
import * as Ag from "../models/AgendamentoModel.js";

const processar = async (el, enviando, original, fn, aviso) => {
  el.disabled = true;
  el.textContent = enviando;
  try {
    await fn();
  } catch (e) {
    el.disabled = false;
    el.textContent = original;
    throw e;
  }
  toast(aviso);
  state.render();
};

export const acoes = {
  cancelar: async el => {
    const sim = await confirmar({
      titulo: "Cancelar agendamento?",
      texto: "O horário voltará a ficar livre para outras pessoas.",
      ok: "Sim, cancelar",
      cancelar: "Manter",
      perigo: true
    });
    if (!sim) return;
    await processar(el, "Cancelando…", "Cancelar", () => Ag.cancelar(+el.dataset.id), "Agendamento cancelado.");
  },

  excluir: async el => {
    const sim = await confirmar({
      titulo: "Excluir do histórico?",
      texto: "Essa ação não pode ser desfeita.",
      ok: "Excluir",
      cancelar: "Voltar",
      perigo: true
    });
    if (!sim) return;
    await processar(el, "Excluindo…", "Excluir", () => Ag.excluir(+el.dataset.id), "Agendamento excluído.");
  }
};