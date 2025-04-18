import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Proxy is set in package.json
});

export default api;