import { t2m, m2t, iso } from "../utils.js";

export function diasDisponiveis(prof, qtd = 10) {
  const r = [], d = new Date();
  for (let i = 0; i < 21 && r.length < qtd; i++) {
    if ((prof.dias || []).includes(d.getDay())) r.push(iso(d));
    d.setDate(d.getDate() + 1);
  }
  return r;
}

export function horariosLivres(prof, servico, dia, ocupados) {
  const busy = ocupados.filter(o => o.inicio.slice(0, 10) === dia)
    .map(o => [t2m(o.inicio.slice(11, 16)), t2m(o.fim.slice(11, 16))]);
  if (prof.alm) busy.push([t2m(prof.alm), t2m(prof.alm) + 60]);
  const n = new Date(), agora = iso(n) === dia ? n.getHours() * 60 + n.getMinutes() : -1, r = [];
  for (let t = t2m(prof.ini); t + servico.dur <= t2m(prof.fim); t += 30) {
    if (t <= agora || busy.some(b => t < b[1] && t + servico.dur > b[0])) continue;
    r.push(m2t(t));
  }
  return r;
}

export const intervalo = (dia, hora, dur) => ({ inicio: `${dia}T${hora}:00`, fim: `${dia}T${m2t(t2m(hora) + dur)}:00` });
