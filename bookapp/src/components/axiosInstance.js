import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001',
  // You can add common headers here, like content-type or authorization tokens
  headers: {},
});

export default API;