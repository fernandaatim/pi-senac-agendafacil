import { sb, ok } from "../config/db.js";

const COM_CLIENTE = "*,servicos(nome,preco),cliente:profiles!cliente_id(nome,telefone)";
const COM_PROF = "*,servicos(nome,preco),prof:profiles!prof_id(nome,endereco)";

export const doProfissional = async id => ok(await sb.from("agendamentos").select(COM_CLIENTE).eq("prof_id", id).order("inicio"));
export const doCliente = async id => ok(await sb.from("agendamentos").select(COM_PROF).eq("cliente_id", id).order("inicio", { ascending: false }));
export const ocupados = async p => ok(await sb.rpc("ocupados", { p }));
export const criar = async a => ok(await sb.from("agendamentos").insert(a));
export const cancelar = async id => ok(await sb.from("agendamentos").update({ status: "cancelado" }).eq("id", id));
export const excluir = async id => ok(await sb.from("agendamentos").delete().eq("id", id));