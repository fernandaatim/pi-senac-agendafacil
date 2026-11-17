import { esc, brl, fdata, DIAS } from "../utils.js";
import { chip, itemAgendamento } from "./ComponentesView.js";

export function agendar({ pros, pro, servicos, servico, dias, horarios, sel }) {
  let h = `<h2>Profissional</h2><div class="chips">${pros.map(p => chip(sel.pro === p.id, "escolherProf", `data-id="${p.id}"`, esc(p.nome))).join("") || `<span class="mut">Nenhum profissional cadastrado.</span>`}</div>`;
  if (!pro) return h;
  if (pro.bio) h += `<p class="mut">${esc(pro.bio)}</p>`;
  h += `<h2>Serviço</h2><div class="chips">${servicos.map(s => chip(sel.sv === s.id, "escolherServico", `data-id="${s.id}"`, `${esc(s.nome)} · ${s.dur} min · ${brl(s.preco)}`)).join("") || `<span class="mut">Sem serviços cadastrados.</span>`}</div>`;
  if (!servico) return h;
  h += `<h2>Dia</h2><div class="chips">${dias.map(x => chip(sel.dia === x, "escolherDia", `data-dia="${x}"`, `${DIAS[new Date(x + "T12:00").getDay()]} ${fdata(x).slice(0, 5)}`)).join("")}</div>`;
  if (!sel.dia) return h;
  h += `<h2>Horário</h2>` + (horarios.length ? `<div class="slots">${horarios.map(t => chip(sel.hora === t, "escolherHora", `data-hora="${t}"`, t)).join("")}</div>` : `<p class="mut">Sem horários livres neste dia. Escolha outro dia.</p>`);
  if (sel.hora) h += `<div class="card"><b>${esc(servico.nome)}</b> em ${fdata(sel.dia)} às ${sel.hora}, com ${esc(pro.nome)}<p></p><button data-act="reservar">Confirmar agendamento</button></div>`;
  return h;
}

export const meus = (lista, agora) => `<h2>Meus agendamentos</h2>` +
  (lista.map(a => itemAgendamento(a, "com " + esc(a.prof?.nome), agora)).join("") || `<p class="mut">Você ainda não agendou nada.</p>`);
