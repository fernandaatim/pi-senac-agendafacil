export const DIAS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
export const $ = s => document.querySelector(s);
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const t2m = t => { const [a, b] = t.split(":"); return +a * 60 + +b; };
export const m2t = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
export const brl = v => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
export const fdata = s => s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4);
export const nowIso = () => { const n = new Date(); return iso(n) + "T" + m2t(n.getHours() * 60 + n.getMinutes()); };