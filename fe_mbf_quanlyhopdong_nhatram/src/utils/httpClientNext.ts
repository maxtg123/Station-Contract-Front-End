import axios from 'axios';

const Axios = axios.create({
  baseURL: '/api',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Change request data/error
Axios.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
  };
  return config;
});

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export class HttpClientNext {
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
