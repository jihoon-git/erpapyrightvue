import axios from 'axios';

const methods = {
  vuecombiListAxios(url, params) {
    return axios.post(url, params);
  },

  /**
   *
   * @param {*} totalCnt 총 데이터 개수
   * @param {*} pageSize  한 화면에 뿌려질 최대 데이터 개수
   */
  page(totalCnt, pageSize) {
    var total = totalCnt;
    var page = pageSize;

    // 만들어지고 남는 페이지 개수
    var xx = total % page;

    // 총 만들어지는 페이지 개수
    var result = parseInt(total / page);

    if (xx == 0) {
      return result;
    } else {
      result = result + 1;
      return result;
    }
  },

  /**
   *
   * @param {*} val number
   * @returns 천단위마다 콤마 찍기
   */
  comma(val) {
    return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   *
   * @param {*} startDate 검색 시작일
   * @param {*} endDate  검색 종료일
   */
  checkStartEndDate(startDate, endDate) {
    if (startDate != '' && endDate != '') {
      if (startDate > endDate) {
        alert('종료일이 시작일 보다 빠를 수 없습니다.');
        return false;
      }
    }
    return true;
  },

  /**
   *
   * @param {*} searchNumber 숫자여부를 검사할 text
   */
  checkEmpNumber(searchNumber) {
    const numbercheck = /^[0-9]*$/;
    if (searchNumber != '') {
      if (!numbercheck.test(searchNumber)) {
        alert('사번에는 숫자만 입력 가능합니다.');
        return false;
      }
    }
    return true;
  },

  /**
   *
   * @param {*} searchLetter 문자 여부를 검사할 text
   */
  checkEmpName(searchLetter) {
    const namecheck = /^[a-zA-Z가-힣]*$/;
    if (searchLetter != '') {
      if (!namecheck.test(searchLetter)) {
        alert('사원명에는 문자만 입력 가능합니다.');
        return false;
      }
    }
    return true;
  },

  // $checkNotEmpty 사용법
  // 입력여부 검사를 하고 싶은 input 태그의 id값과 alert 메시지를
  // ['id', 'alert 창에 들어갈 메시지'] 형태(2차원배열)로 넣어준다
  // 여러개 쓰려면 []로 한번 더 묶어줌
  // let checkEmpName = this.$checkNotEmpty([
  //   ['sEmpName', '테스트 사원명을 입력해주세요'],
  //   ['srcsdate', '검색 시작일을 선택해주세요'],
  //   ['client_no', '거래처명을 선택 해주세요'],
  // ]);
  // if (checkEmpName) {
  //   return checkEmpName;
  // }

  /**
   *
   * @param {*} arr ['id', 'alert 창에 들어갈 메시지'] 형태(2차원배열)
   */
  checkNotEmpty: function (arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      var elem = document.getElementById(arr[i][0]);
      console.log('elem is...');
      console.log(elem);
      if (elem.length <= 0) {
        continue;
      }
      var elemValue = elem.value;
      var alertMsg = arr[i][1];

      console.log(elemValue);
      if (elemValue == '') {
        alert(alertMsg);
        elem.focus();
        return false;
      }
    }
    return true;
  },
};

export default {
  install(Vue) {
    Vue.config.globalProperties.$vuecombiListAxios = methods.vuecombiListAxios;
    Vue.config.globalProperties.$page = methods.page;
    Vue.config.globalProperties.$comma = methods.comma;
    Vue.config.globalProperties.$checkStartEndDate = methods.checkStartEndDate;
    Vue.config.globalProperties.$checkEmpNumber = methods.checkEmpNumber;
    Vue.config.globalProperties.$checkEmpName = methods.checkEmpName;
    Vue.config.globalProperties.$checkNotEmpty = methods.checkNotEmpty;
  },
};
