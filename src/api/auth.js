// src/api/auth.js
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export const login = (username, password) => {
  return axios.post(`${API_URL}/api/auth/login`, { username, password });
};

export const register = (user) => {
  return axios.post(`${API_URL}/api/auth/register`, user);
};