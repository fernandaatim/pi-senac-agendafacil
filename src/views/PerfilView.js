// Tela de perfil (igual para cliente e profissional; o profissional tem o campo extra "bio")
import { esc } from "../utils.js";

export const perfil = me => `<h2>Meu perfil</h2><div class="card">
  <label for="pn">Nome</label><input id="pn" value="${esc(me.nome)}">
  <label for="pt">Telefone</label><input id="pt" type="tel" value="${esc(me.telefone)}">
  ${me.role === "profissional" ? `<label for="pb">Sobre meu trabalho</label><textarea id="pb" rows="3">${esc(me.bio)}</textarea>` : ""}
  <p></p><button data-act="salvarPerfil">Salvar perfil</button></div>`;
