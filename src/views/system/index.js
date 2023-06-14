import axios from 'axios';

function vuecombiListAxios(url, params) {
  return axios.post(url, params);
}

export { vuecombiListAxios };
