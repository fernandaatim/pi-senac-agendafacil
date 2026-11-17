import { state } from "../state.js";
import * as Ag from "../models/AgendamentoModel.js";

export const acoes = {
  cancelar: async el => { if (!confirm("Cancelar este agendamento?")) return; await Ag.cancelar(+el.dataset.id); state.render(); },
  excluir: async el => { await Ag.excluir(+el.dataset.id); state.render(); }
};
