const icone = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18M9 15l2 2 4-4"/></svg>`;
const logo = `<div class="logo">${icone}<span>Agenda<b>Fácil</b></span></div>`;
const voltar = `<p class="login-alt"><button type="button" class="link" data-act="modoAuth" data-modo="entrar">Voltar para o login</button></p>`;

const regras = `<ul class="regras" id="regras">
  <li data-r="len">Mínimo de 8 caracteres</li>
  <li data-r="up">1 letra maiúscula</li>
  <li data-r="num">1 número</li>
  <li data-r="esp">1 caractere especial</li>
  </ul>`;

const confirmar = `<label for="a-c">Confirmar senha</label>
  <input id="a-c" type="password" placeholder="Repita a senha" autocomplete="new-password" required>`;

export function formulario(modo) {
  if (modo === "recuperar") {
    return `<form class="login" data-submit="recuperar">
    ${logo}
    <h1>RECUPERAR SENHA</h1>
    <p class="mut centro">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
    <label for="a-e">E-mail</label>
    <input id="a-e" type="email" placeholder="seu@email.com" autocomplete="email" required>
    <p class="err" id="err"></p>
    <button class="big" type="submit">Enviar link</button>
    ${voltar}
    </form>`;
  }
  if (modo === "novasenha") {
    return `<form class="login" data-submit="novaSenha">
    ${logo}
    <h1>NOVA SENHA</h1>
    <label for="a-s">Nova senha</label>
    <input id="a-s" type="password" placeholder="Nova senha" autocomplete="new-password" required>
    ${regras}
    ${confirmar}
    <p class="err" id="err"></p>
    <button class="big" type="submit">Salvar nova senha</button>
    </form>`;
  }
  const cad = modo === "cadastro";
  return `<form class="login" data-submit="${cad ? "cadastrar" : "entrar"}">
  ${logo}
  <h1>${cad ? "CRIAR CONTA" : "LOGIN"}</h1>
  ${cad ? `<label for="a-n">Nome</label><input id="a-n" autocomplete="name" required>
  <label for="a-r">Eu sou</label>
  <select id="a-r">
    <option value="cliente">Cliente</option>
    <option value="profissional">Profissional autônomo</option>
  </select>` : ""}
  <label for="a-e">E-mail</label>
  <input id="a-e" type="email" placeholder="seu@email.com" autocomplete="email" required>
  <label for="a-s">Senha</label>
  <input id="a-s" type="password" placeholder="Senha" autocomplete="${cad ? "new" : "current"}-password" required>
  ${cad ? regras + confirmar : `<p class="forgot"><button type="button" class="link" data-act="modoAuth" data-modo="recuperar">Esqueceu a senha?</button></p>`}
  <p class="err" id="err"></p>
  <button class="big" type="submit">${cad ? "Criar conta" : "Entrar"}</button>
  <p class="login-alt">${cad ? "Já tem conta?" : "Não tem uma conta?"}
    <button type="button" class="link" data-act="modoAuth" data-modo="${cad ? "entrar" : "cadastro"}">${cad ? "Entrar" : "Inscrever-se"}</button></p>
  </form>`;
}