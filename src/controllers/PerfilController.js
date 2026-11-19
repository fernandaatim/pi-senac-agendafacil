import { state } from "../state.js";
import { $, toast } from "../utils.js";
import * as Pf from "../models/PerfilModel.js";
import { perfil } from "../views/PerfilView.js";

export const telas = { perfil: () => perfil(state.me) };

export const acoes = {
  salvarPerfil: async () => {
    const nome = $("#pn").value.trim();
    if (!nome) return toast("O nome é obrigatório.", "erro");
    const u = { nome, telefone: $("#pt").value.trim() };
    const primeiraVez = state.me.role === "profissional" && !state.me.endereco;
    if ($("#pe")) {
      const endereco = $("#pe").value.trim();
      if (!endereco) return toast("Informe o endereço de atendimento.", "erro");
      u.endereco = endereco;
      u.bio = $("#pb").value.trim();
    }
    await Pf.atualizar(state.me.id, u);
    Object.assign(state.me, u);
    toast("Perfil salvo.");
    if (primeiraVez) state.tab = "agenda";
    state.render();
  }
};