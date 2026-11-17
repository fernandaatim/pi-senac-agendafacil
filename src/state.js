export const state = {
  me: null,                                            // perfil do usuário logado
  tab: "",                                             // aba atual
  sel: {},                                             // seleções da tela atual
  modo: "entrar",                                      // tela de login ou cadastro
  pid: new URLSearchParams(location.search).get("p"),  // profissional do link público
  render: () => {}                                     // preenchido pelo app.js
};
