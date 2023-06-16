import axios from 'axios';

const methods = {
  vuecombiListAxios(url, params) {
    return axios.post(url, params);
  },
  page(totalCnt, pageSize) {
    var total = totalCnt;
    var page = pageSize;
    var xx = total % page;
    var result = parseInt(total / page);

    if (xx == 0) {
      return result;
    } else {
      result = result + 1;
      return result;
    }
  },
  comma(val) {
    return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
};

export default {
  install(Vue) {
    Vue.config.globalProperties.$vuecombiListAxios = methods.vuecombiListAxios;
    Vue.config.globalProperties.$page = methods.page;
    Vue.config.globalProperties.$comma = methods.comma;
  },
};
