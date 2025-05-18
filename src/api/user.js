// src/api/user.js
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export const getUsers = () => {
  return axios.get(`${API_URL}/api/users`);
};