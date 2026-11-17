import { sb, ok } from "./db.js";
export const entrar = async (email, password) => ok(await sb.auth.signInWithPassword({ email, password }));
export const cadastrar = async (email, password, nome, role) =>
  ok(await sb.auth.signUp({ email, password, options: { data: { nome, role } } }));
export const sair = () => sb.auth.signOut();
export const aoMudarSessao = cb => sb.auth.onAuthStateChange((ev, s) => { if (ev !== "TOKEN_REFRESHED") setTimeout(() => cb(s), 0); });
export const carregarPerfil = async id => ok(await sb.from("profiles").select("*").eq("id", id).single());
