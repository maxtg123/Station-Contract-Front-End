import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { PATH_AUTH } from 'src/routes/paths';

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Change request data/error
const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'authToken';
Axios.interceptors.request.use((config) => {
  const cookies = Cookies.get(AUTH_TOKEN_KEY);
  let token = '';
  if (cookies) {
    token = JSON.parse(cookies).token;
  }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove(AUTH_TOKEN_KEY);
      Router.replace(PATH_AUTH.login);
    }
    return Promise.reject(error);
  }
);

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async fullPost<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response;
  }

  static async put<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.put<T>(url, data, options);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }
}

export function getFormErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.message;
  }
  return null;
}

export function getFieldErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.errors;
  }
  return null;
}
