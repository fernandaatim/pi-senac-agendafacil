import { esc, brl, DIAS } from "../utils.js";
import { chip, itemAgendamento } from "./ComponentesView.js";

export function agenda(ags, link, agora) {
  const q = a => itemAgendamento(a, `${esc(a.cliente?.nome)} · ${esc(a.cliente?.telefone || "sem telefone")}`, agora);
  const ativo = a => a.fim > agora && a.status === "confirmado";
  return `<h2>Próximos atendimentos</h2>${ags.filter(ativo).map(q).join("") || `<p class="mut">Nenhum agendamento ainda. Envie seu link aos clientes.</p>`}
  <div class="card"><b>Seu link de agendamento</b><p class="mut" style="word-break:break-all">${esc(link)}</p>
  <button class="sm" data-act="copiarLink" data-link="${esc(link)}">Copiar link</button></div>
  <h2>Histórico</h2>${ags.filter(a => !ativo(a)).reverse().map(q).join("") || `<p class="mut">Atendimentos passados e cancelados aparecem aqui.</p>`}`;
}

export const servicos = lista => `<h2>Meus serviços</h2>` +
  (lista.map(s => `<div class="card row sp"><span>${esc(s.nome)} · ${s.dur} min · ${brl(s.preco)}</span><span class="row">
  <button class="sm sec" data-act="editarServico" data-id="${s.id}" data-nome="${esc(s.nome)}" data-dur="${s.dur}" data-preco="${s.preco}">Editar</button>
  <button class="sm bad" data-act="excluirServico" data-id="${s.id}">Excluir</button></span></div>`).join("") || `<p class="mut">Cadastre o primeiro serviço abaixo.</p>`) +
  `<h2>Novo serviço</h2><div class="card"><label for="sn">Nome</label><input id="sn">
  <div class="row"><div class="grow"><label for="sd">Duração (min)</label><input id="sd" type="number" min="15" step="15"></div>
  <div class="grow"><label for="sp">Preço (R$)</label><input id="sp" type="number" min="0"></div></div><p></p>
  <button data-act="addServico">Adicionar serviço</button></div>`;

export const config = (me, dias) => `<h2>Dias de atendimento</h2>
  <div class="chips">${DIAS.map((d, i) => chip(dias.includes(i), "alternarDia", `data-dia="${i}"`, d)).join("")}</div>
  <div class="card row"><div class="grow"><label for="hi">Início</label><input id="hi" type="time" value="${me.ini}"></div>
  <div class="grow"><label for="hf">Fim</label><input id="hf" type="time" value="${me.fim}"></div>
  <div class="grow"><label for="ha">Almoço (1h)</label><input id="ha" type="time" value="${me.alm || ""}"></div></div>
  <button data-act="salvarConfig">Salvar disponibilidade</button>`;
