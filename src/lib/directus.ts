// lib/axios.ts
import axios from 'axios';

const directusUrl = 'https://brandlybook.store';

export const clientAxios = axios.create({
  baseURL: directusUrl,
  withCredentials: true,
});

export const serverAxios = axios.create({
  baseURL: directusUrl,
  withCredentials: true,
});
