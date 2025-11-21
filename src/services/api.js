import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jwtAPI = {
  // Analizar JWT completo
  analyze: async (token, secret = null) => {
    const response = await api.post('/analyze', { token, secret });
    return response.data;
  },

  // Codificar JWT
  encode: async (payload, secret, algorithm = 'HS256', expiresIn = null) => {
    const data = {
      payload,
      secret,
      algorithm,
      ...(expiresIn && { expires_in: expiresIn })
    };
    const response = await api.post('/encode', data);
    return response.data;
  },

  // Decodificar JWT
  decode: async (token) => {
    const response = await api.post('/decode', { token });
    return response.data;
  },

  // Verificar firma
  verify: async (token, secret) => {
    const response = await api.post('/verify', { token, secret });
    return response.data;
  },
};

export default api;