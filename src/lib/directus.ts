// lib/axios.ts
import axios from 'axios';

const directusUrl = 'https://luxeenbois.com';

export const clientAxios = axios.create({
  baseURL: directusUrl,
  withCredentials: true,
});

export const serverAxios = axios.create({
  baseURL: directusUrl,
  withCredentials: true,
});
