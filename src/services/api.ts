const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async post(path: string, body: any) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error en la petición');
    }
    return res.json();
  },

  async get(path: string) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error en la petición');
    }
    return res.json();
  },

  async put(path: string, body: any) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error en la petición');
    }
    return res.json();
  },
};
