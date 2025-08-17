// Normalizes ALL fetch/axios calls so they hit the right base and don't drop /api.
import axios from "axios";

const DEV = import.meta.env.DEV;
const BACKEND_BASE = DEV
  ? "/api"
  : `${import.meta.env.VITE_API_BASE_URL}/api`;

const KNOWN_FULLS = [
  "http://localhost:4000/api",
  import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : null,
  "https://codelabx.onrender.com/api",
].filter(Boolean);

function rewriteToBase(url) {
  if (typeof url !== "string") return url;

  // rewrite known full origins to current base
  for (const full of KNOWN_FULLS) {
    if (url.startsWith(full)) return BACKEND_BASE + url.slice(full.length);
  }
  // IMPORTANT: if caller passed "/path", strip the leading slash so axios keeps "/api"
  if (url.startsWith("/")) return url.replace(/^\/+/, "");
  return url;
}

// Patch fetch
if (typeof window !== "undefined" && typeof window.fetch === "function") {
  const _fetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === "string") return _fetch(rewriteToBase(input), init);
    return _fetch(input, init);
  };
}

// Patch axios (defaults + all created instances)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = BACKEND_BASE;

function addNormalizer(client) {
  client.interceptors.request.use((cfg) => {
    if (cfg?.url) {
      const fixed = rewriteToBase(String(cfg.url));
      if (fixed !== cfg.url) cfg.url = fixed;
    }
    return cfg;
  });
  return client;
}
addNormalizer(axios);

const _create = axios.create.bind(axios);
axios.create = function patchedCreate(config) {
  const inst = _create(config);
  if (!inst.defaults.baseURL) inst.defaults.baseURL = BACKEND_BASE;
  inst.defaults.withCredentials = true;
  return addNormalizer(inst);
};

export { BACKEND_BASE };
