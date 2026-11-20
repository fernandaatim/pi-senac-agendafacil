import { state } from "../state.js";
import { $, senhaForte, traduzir } from "../utils.js";
import * as Auth from "../models/AuthModel.js";

const msg = (texto, ok = false) => {
  const el = $("#err");
  el.className = ok ? "msg" : "err";
  el.textContent = texto;
};

const carregando = (btn, texto) => {
  const original = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = `<span class="spin"></span>${texto}`;
  return () => {
    btn.disabled = false;
    btn.textContent = original;
  };
};

const validarSenha = () => {
  const senha = $("#a-s").value;
  if (!senhaForte(senha)) return "A senha precisa ter 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.";
  if (senha !== $("#a-c").value) return "As senhas não coincidem.";
  return "";
};

export const acoes = {
  modoAuth: el => { state.modo = el.dataset.modo; state.render(); },

  entrar: async el => {
    msg("");
    const parar = carregando(el, "Entrando…");
    try {
      await Auth.entrar($("#a-e").value.trim(), $("#a-s").value);
    } catch {
      msg("E-mail ou senha incorretos.");
      parar();
    }
  },

  cadastrar: async el => {
    msg("");
    const nome = $("#a-n").value.trim();
    if (!nome) return msg("Informe seu nome.");
    const erro = validarSenha();
    if (erro) return msg(erro);
    const parar = carregando(el, "Criando conta…");
    try {
      const r = await Auth.cadastrar($("#a-e").value.trim(), $("#a-s").value, nome, $("#a-r").value);
      if (!r.session) {
        msg("Conta criada. Confirme o e-mail e depois entre.", true);
        parar();
      }
    } catch (e) {
      msg(traduzir(e.message));
      parar();
    }
  },

  recuperar: async el => {
    msg("");
    const email = $("#a-e").value.trim();
    if (!email) return msg("Informe seu e-mail.");
    const parar = carregando(el, "Enviando…");
    try {
      await Auth.recuperarSenha(email);
      msg("Se o e-mail estiver cadastrado, você receberá um link para criar a nova senha.", true);
    } catch (e) {
      msg(traduzir(e.message));
    }
    parar();
  },

  novaSenha: async el => {
    msg("");
    const erro = validarSenha();
    if (erro) return msg(erro);
    const parar = carregando(el, "Salvando…");
    try {
      await Auth.novaSenha($("#a-s").value);
      history.replaceState(null, "", location.pathname + location.search);
      state.modo = "entrar";
      const s = await Auth.sessaoAtual();
      state.me = s ? await Auth.carregarPerfil(s.user.id) : null;
      state.tab = "";
      state.sel = {};
      state.render();
    } catch (e) {
      msg(traduzir(e.message));
      parar();
    }
  },

  sair: () => {
    state.modo = "entrar";
    return Auth.sair();
  }
};