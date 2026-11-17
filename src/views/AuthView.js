// Tela de login e cadastro
export function formulario(modo) {
  const cad = modo === "cadastro";
  return `<h1>${cad ? "Criar conta" : "Entrar"}</h1><div class="card">
  ${cad ? `<label for="a-n">Nome</label><input id="a-n" autocomplete="name">
  <label for="a-r">Eu sou</label><select id="a-r"><option value="cliente">Cliente</option><option value="profissional">Profissional autônomo</option></select>` : ""}
  <label for="a-e">E-mail</label><input id="a-e" type="email" autocomplete="email">
  <label for="a-s">Senha (mín. 6 caracteres)</label><input id="a-s" type="password" autocomplete="${cad ? "new" : "current"}-password">
  <p class="err" id="err"></p>
  <div class="row"><button data-act="${cad ? "cadastrar" : "entrar"}">${cad ? "Criar conta" : "Entrar"}</button>
  <button class="sec" data-act="modoAuth" data-modo="${cad ? "entrar" : "cadastro"}">${cad ? "Já tenho conta" : "Criar conta"}</button></div></div>`;
}
