import { state } from "../state.js";
import { $ } from "../utils.js";
import * as Auth from "../models/AuthModel.js";

export const acoes = {
  modoAuth: el => { state.modo = el.dataset.modo; state.render(); },
  entrar: async () => {
    try { await Auth.entrar($("#a-e").value.trim(), $("#a-s").value); }
    catch { $("#err").textContent = "E-mail ou senha incorretos."; }
  },
  cadastrar: async () => {
    const nome = $("#a-n").value.trim();
    if (!nome) { $("#err").textContent = "Informe seu nome."; return; }
    try {
      const r = await Auth.cadastrar($("#a-e").value.trim(), $("#a-s").value, nome, $("#a-r").value);
      if (!r.session) $("#err").textContent = "Conta criada. Confirme o e-mail e depois entre.";
    } catch (e) { $("#err").textContent = e.message; }
  },
  sair: () => Auth.sair()
};
