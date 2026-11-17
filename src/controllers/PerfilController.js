import { state } from "../state.js";
import { $ } from "../utils.js";
import * as Pf from "../models/PerfilModel.js";
import { perfil } from "../views/PerfilView.js";

export const telas = { perfil: () => perfil(state.me) };

export const acoes = {
  salvarPerfil: async () => {
    const nome = $("#pn").value.trim();
    if (!nome) return alert("O nome é obrigatório.");
    const u = { nome, telefone: $("#pt").value.trim() };
    if ($("#pb")) u.bio = $("#pb").value.trim();
    await Pf.atualizar(state.me.id, u); Object.assign(state.me, u);
    alert("Perfil salvo."); state.render();
  }
};
