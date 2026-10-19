import { API_URL } from './config';

let token = null;
export const setToken = (t) => {
  token = t;
};

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando e a URL em config.js.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição.');
  return data;
}

export const api = {
  // autenticação
  cadastrar: (dados) => request('/auth/cadastro', { method: 'POST', body: dados }),
  login: (dados) => request('/auth/login', { method: 'POST', body: dados }),
  me: () => request('/auth/me'),

  // currículos
  listar: (busca = '') => request(`/curriculos?busca=${encodeURIComponent(busca)}`),
  meus: () => request('/curriculos/meus'),
  obter: (id) => request(`/curriculos/${id}`),
  criar: (dados) => request('/curriculos', { method: 'POST', body: dados }),
  atualizar: (id, dados) => request(`/curriculos/${id}`, { method: 'PUT', body: dados }),
  excluir: (id) => request(`/curriculos/${id}`, { method: 'DELETE' }),
};
