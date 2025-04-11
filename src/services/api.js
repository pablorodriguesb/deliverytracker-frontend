import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Ponto base do seu backend
});

export default api;
