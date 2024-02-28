// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace this with your NestJS backend URL

const api = axios.create({
  baseURL: API_URL,
});

export default api;
