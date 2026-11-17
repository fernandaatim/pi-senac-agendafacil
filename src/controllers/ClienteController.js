import { state } from "../state.js";
import { nowIso } from "../utils.js";
import * as Ag from "../models/AgendamentoModel.js";
import * as Sv from "../models/ServicoModel.js";
import { listarProfissionais } from "../models/PerfilModel.js";
import { diasDisponiveis, horariosLivres, intervalo } from "../models/HorarioModel.js";
import * as V from "../views/ClienteView.js";

let ctx = {};

export const telas = {
  agendar: async () => {
    const sel = state.sel; sel.pro ??= state.pid;
    const pros = await listarProfissionais(), pro = pros.find(p => p.id === sel.pro);
    const servicos = pro ? await Sv.listar(pro.id) : [], servico = servicos.find(s => s.id === sel.sv);
    const horarios = servico && sel.dia ? horariosLivres(pro, servico, sel.dia, await Ag.ocupados(pro.id)) : [];
    ctx = { pro, servico };
    return V.agendar({ pros, pro, servicos, servico, dias: pro ? diasDisponiveis(pro) : [], horarios, sel });
  },
  meus: async () => V.meus(await Ag.doCliente(state.me.id), nowIso())
};

export const acoes = {
  escolherProf: el => { state.sel = { pro: el.dataset.id }; state.render(); },
  escolherServico: el => { Object.assign(state.sel, { sv: +el.dataset.id, hora: null }); state.render(); },
  escolherDia: el => { Object.assign(state.sel, { dia: el.dataset.dia, hora: null }); state.render(); },
  escolherHora: el => { state.sel.hora = el.dataset.hora; state.render(); },
  reservar: async () => {
    const s = state.sel, { pro, servico } = ctx;
    try {
      await Ag.criar({ prof_id: pro.id, cliente_id: state.me.id, servico_id: servico.id, ...intervalo(s.dia, s.hora, servico.dur) });
    } catch (e) {
      if (e.code === "23P01") { alert("Esse horário acabou de ser reservado por outra pessoa. Escolha outro."); s.hora = null; return state.render(); }
      throw e;
    }
    alert("Agendamento confirmado!");
    state.tab = "meus"; state.sel = {}; state.render();
  }
};
