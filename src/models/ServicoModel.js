import { sb, ok } from "../config/db.js";
export const listar = async profId => ok(await sb.from("servicos").select("*").eq("prof_id", profId).order("nome"));
export const criar = async s => ok(await sb.from("servicos").insert(s));
export const atualizar = async (id, c) => ok(await sb.from("servicos").update(c).eq("id", id));
export const excluir = async id => ok(await sb.from("servicos").delete().eq("id", id));
