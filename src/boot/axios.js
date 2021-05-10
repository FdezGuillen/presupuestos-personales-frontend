import Vue from 'vue'
import axios from 'axios';
import store from '../store';

// Configuramos axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
});

// Si existe token, lo añadimos a las cabeceras
const token = localStorage.getItem('token')
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = token
}

export default async ({
  Vue
}) => {
  Vue.prototype.$axios = axiosInstance;
  Vue.prototype.$store = store;
}

export {
  axiosInstance
}
