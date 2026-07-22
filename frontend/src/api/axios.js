import axios from 'axios';

const API = axios.create({
  baseURL: '/api/v1',
  withCredentials: true // Automatically passes HttpOnly cookies with every request
});

export default API;
