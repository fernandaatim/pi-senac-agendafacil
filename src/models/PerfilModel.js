import { sb, ok } from "../config/db.js";

export const atualizar = async (id, campos) => ok(await sb.from("profiles").update(campos).eq("id", id));
export const listarProfissionais = async () =>
  ok(await sb.from("profiles").select("id,nome,bio,endereco,dias,ini,fim,alm").eq("role", "profissional").not("endereco", "is", null));