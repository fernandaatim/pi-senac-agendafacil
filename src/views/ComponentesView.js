// Peças de HTML reaproveitadas em várias telas
import { esc, fdata } from "../utils.js";

export const chip = (on, act, attrs, txt) => `<button class="chip ${on ? "on" : ""}" data-act="${act}" ${attrs}>${txt}</button>`;

export const itemAgendamento = (a, quem, agora) => `<div class="card row sp"><div><b>${fdata(a.inicio.slice(0, 10))} ${a.inicio.slice(11, 16)}</b> · ${esc(a.servicos?.nome || "Serviço removido")}<br><span class="mut">${quem}</span></div>
  <div class="row"><span class="tag ${a.status}">${a.status}</span>
  ${a.status === "confirmado" && a.fim > agora ? `<button class="sm bad" data-act="cancelar" data-id="${a.id}">Cancelar</button>` : ""}
  ${a.status === "cancelado" ? `<button class="sm sec" data-act="excluir" data-id="${a.id}">Excluir</button>` : ""}</div></div>`;
