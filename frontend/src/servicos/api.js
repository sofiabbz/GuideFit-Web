import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Adiciona o token ao cabeçalho automaticamente se existir
api.interceptors.request.use((configuracao) => {
  const token = localStorage.getItem('token')
  if (token) {
    configuracao.headers.Authorization = `Bearer ${token}`
  }
  return configuracao
})

export default api
