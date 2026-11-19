export const DIAS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
export const $ = s => document.querySelector(s);
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const t2m = t => { const [a, b] = t.split(":"); return +a * 60 + +b; };
export const m2t = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
export const brl = v => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
export const fdata = s => s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4);
export const nowIso = () => { const n = new Date(); return iso(n) + "T" + m2t(n.getHours() * 60 + n.getMinutes()); };
export function toast(texto, tipo = "ok") {
  let area = document.querySelector("#toasts");
  if (!area) {
    area = document.createElement("div");
    area.id = "toasts";
    area.setAttribute("role", "status");
    area.setAttribute("aria-live", "polite");
    document.body.appendChild(area);
  }
  const t = document.createElement("div");
  t.className = "toast " + tipo;
  t.textContent = texto;
  area.appendChild(t);
  setTimeout(() => {
    t.classList.add("sai");
    setTimeout(() => t.remove(), 250);
  }, tipo === "erro" ? 4500 : 2800);
}

export const REGRAS_SENHA = {
  len: s => s.length >= 8,
  up: s => /\p{Lu}/u.test(s),
  num: s => /\d/.test(s),
  esp: s => /[^\p{L}\p{N}\s]/u.test(s)
};

export const senhaForte = s => Object.values(REGRAS_SENHA).every(f => f(s));

export function traduzir(msg = "") {
  const m = String(msg).toLowerCase();
  const tabela = [
    ["different from the old", "A nova senha precisa ser diferente da anterior."],
    ["already registered", "Este e-mail já está cadastrado."],
    ["already been registered", "Este e-mail já está cadastrado."],
    ["invalid login", "E-mail ou senha incorretos."],
    ["email not confirmed", "Confirme seu e-mail antes de entrar."],
    ["rate limit", "Muitas tentativas. Aguarde alguns minutos e tente de novo."],
    ["only request this after", "Por segurança, aguarde alguns segundos antes de tentar de novo."],
    ["invalid format", "E-mail inválido."],
    ["unable to validate email", "E-mail inválido."],
    ["session missing", "O link expirou. Peça um novo link de recuperação."],
    ["expired", "O link expirou. Peça um novo link de recuperação."],
    ["password should", "A senha não atende aos requisitos mínimos."],
    ["weak", "Essa senha é fraca ou já apareceu em vazamentos. Escolha outra."],
    ["failed to fetch", "Sem conexão com o servidor. Verifique sua internet."],
    ["signups not allowed", "Os cadastros estão desativados."]
  ];
  const achou = tabela.find(([chave]) => m.includes(chave));
  if (achou) return achou[1];
  console.error(msg);
  return "Algo deu errado. Tente novamente.";
}

export function confirmar({ titulo, texto = "", ok = "Confirmar", cancelar = "Voltar", perigo = false }) {
  return new Promise(resolve => {
    const d = document.createElement("dialog");
    d.className = "modal";
    d.innerHTML = `<div class="corpo"><h2>${esc(titulo)}</h2><p class="mut">${esc(texto)}</p>
      <div class="acoes"><button type="button" class="sec" data-v="0">${esc(cancelar)}</button>
      <button type="button" class="${perigo ? "danger" : ""}" data-v="1">${esc(ok)}</button></div></div>`;
    let fechando = false;
    const fechar = v => {
      if (fechando) return;
      fechando = true;
      d.classList.add("saindo");
      setTimeout(() => { d.close(); d.remove(); resolve(v); }, 150);
    };
    d.addEventListener("click", e => {
      const b = e.target.closest("[data-v]");
      if (b) fechar(b.dataset.v === "1");
      else if (e.target === d) fechar(false);
    });
    d.addEventListener("cancel", e => { e.preventDefault(); fechar(false); });
    document.body.appendChild(d);
    d.showModal();
    d.querySelector('[data-v="0"]').focus();
  });
}