import { sb, ok } from "../config/db.js";

export const atualizar = async (id, campos) => ok(await sb.from("profiles").update(campos).eq("id", id));
export const listarProfissionais = async () =>
  ok(await sb.from("profiles").select("id,nome,bio,endereco,dias,ini,fim,alm").eq("role", "profissional"));

export const entrar = async (email, password) => ok(await sb.auth.signInWithPassword({ email, password }));
export const cadastrar = async (email, password, nome, role) =>
  ok(await sb.auth.signUp({ email, password, options: { data: { nome, role } } }));
export const sair = () => sb.auth.signOut();
export const aoMudarSessao = cb => sb.auth.onAuthStateChange((ev, s) => {
  if (ev !== "TOKEN_REFRESHED") setTimeout(() => cb(s, ev), 0);
});
export const carregarPerfil = async id => ok(await sb.from("profiles").select("*").eq("id", id).single());
export const recuperarSenha = async email =>
  ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }));
export const novaSenha = async password => ok(await sb.auth.updateUser({ password }));
export const sessaoAtual = async () => ok(await sb.auth.getSession()).session;