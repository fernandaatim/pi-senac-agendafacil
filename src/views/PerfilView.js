import { esc } from "../utils.js";

export const perfil = me => {
  const falta = me.role === "profissional" && !me.endereco;
  return `<h2>Meu perfil</h2>
  ${falta ? `<p class="aviso">Cadastre o endereço de atendimento para começar a usar o sistema. Sem ele, os clientes não encontram você.</p>` : ""}
  <div class="card">
  <label for="pn">Nome</label><input id="pn" value="${esc(me.nome)}">
  <label for="pt">Telefone</label><input id="pt" type="tel" value="${esc(me.telefone)}">
  ${me.role === "profissional" ? `<label for="pe">Endereço de atendimento</label>
  <input id="pe" value="${esc(me.endereco)}" placeholder="Rua, número, bairro, cidade">
  <label for="pb">Sobre meu trabalho (opcional)</label><textarea id="pb" rows="3">${esc(me.bio)}</textarea>` : ""}
  <p></p><button data-act="salvarPerfil">Salvar perfil</button></div>`;
};