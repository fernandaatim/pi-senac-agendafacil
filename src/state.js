export const state = {
  me: null,
  tab: "",
  sel: {},
  cache: {},
  modo: location.hash.includes("type=recovery") ? "novasenha" : "entrar",
  pid: new URLSearchParams(location.search).get("p"),
  render: () => {}
};