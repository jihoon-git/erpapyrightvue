<template>
  <form id="myForm" action="" method="post">
    <div id="background_board">
      <div class="login_form shadow" align="center">
        <div class="login-form-right-side" style="font-size: 15px">
          <div class="top-logo-wrap">
            <img
              id="login-logo"
              src="@/assets/images/admin/login/logo_img.png"
            />
          </div>
          <h3>안되는 것이 실패가 아니라 포기하는 것이 실패다</h3>
          <p>
            성공은 실패의 꼬리를 물고 온다. 지금 포기한 것이 있는가?<br />
            그렇다면 다시 시작해 보자.<br />
            안되는 것이 실패가 아니라 포기하는 것이 실패다.<br />
            포기한 순간이 성공하기 5분전이기 쉽다.<br />
            실패에서 더 많이 배운다.<br />
            실패를 반복해서 경험하면 실망하기 쉽다. <br />하지만 포기를 생각해선
            안된다. 실패는 언제나 중간역이지 종착역은 아니다. <br />
          </p>
          <p>- 이대희, ‘1%의 가능성을 희망으로 바꾼 사람들’ 에서</p>
        </div>
        <div class="login-form-left-side">
          <fieldset>
            <legend>로그인</legend>
            <p class="id">
              <label for="user_id">아이디</label>
              <input
                v-model="lgn_Id"
                id="EMP_ID"
                type="text"
                name="lgn_Id"
                placeholder="아이디"
                style="ime-mode: inactive"
                @keypress="checkCode"
              />
            </p>
            <p class="pw">
              <label for="user_pwd">비밀번호</label>
              <input
                v-model="pwd"
                id="EMP_PWD"
                type="password"
                name="pwd"
                placeholder="비밀번호"
                onfocus="this.placeholder=''; return true"
                @keypress="checkCode"
              />
            </p>
            <p class="member_info">
              <input
                v-model="saveId"
                id="cb_saveId"
                type="checkbox"
                @keypress="checkCode"
              />
              <span class="id_save">ID저장</span>
            </p>
            <div>
              <a href="" id="RegisterBtn" name="modal"
                ><strong>[회원가입]</strong></a
              >
              <a href=""><strong>[아이디/비밀번호 찾기]</strong></a>
            </div>
            <!-- Login Btn -->
            <a class="btn_login" id="btn_login" @click="fLoginProc">
              <strong>Login</strong>
            </a>
          </fieldset>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
//import Dashboard from "@/views/Dashboard.vue";
import '../assets/css/admin/login.css';
// import "../assets/js/common.js";
export default {
  data: function () {
    return {
      lgn_Id: '',
      pwd: '',
      saveId: false,
    };
  },
  mounted: function () {
    let savedID = this.getCookie('EMP_ID');
    this.lgn_Id = savedID || '';
    this.savedID = savedID != '' ? true : false;
  },
  methods: {
    // Vue 공식 홈페이지에 있는 방식으로는 ()=>{} 화살표 함수형식으로의 작성을
    // 권장하지 않는다. 특히 this.var... 처럼 Vue 인스턴스의 값을 얻어오려 할때
    // 화살표 함수로 작성한 메소드의 경우 받아오지 못하는 현상이 발생한다.
    // ref :
    // http://1004lucifer.blogspot.com/2020/06/vuejs-methods-this-this.html
    checkCode: function (event) {
      if (event.keyCode == 13) this.fLoginProc();
    },
    fLoginProc: function () {
      if (this.isValidated()) {
        let vm = this;

        console.log('Proc login,,,');
        this.saveCookie('EMP_ID', this.lgn_Id, this.saveId == true ? 7 : -1);

        this.axios
          .post(
            '/loginProc.do',
            new URLSearchParams({ lgn_Id: this.lgn_Id, pwd: this.pwd })
          )
          .then((resp) => {
            let data = resp.data;
            if (data.result == 'SUCCESS') {
              this.$store.commit('logged', {
                loginId: data.loginId,
                userNm: data.userNm,
                userType: data.userType,
                serverName: data.serverName,
                usrMnuAtrt: data.usrMnuAtrt,
              });
              this.$store.commit('auth', { type: data.userType });

              // guide for making vue files
              data.usrMnuAtrt.forEach(function (item) {
                console.log(item.mnu_nm);
                item.nodeList.forEach(function (item) {
                  let purl = item.mnu_url.replace('.do', '.vue');
                  let vueFilePath = '@/views' + purl;
                  console.log(
                    '  메뉴명: ' + item.mnu_nm + ' || 파일경로 : ' + vueFilePath
                  );
                });
              });
              ////////////////////////////////

              this.$session.set('loginId', resp.data.loginId);
              this.$session.set('userNm', resp.data.userNm);
              this.$session.set('userType', resp.data.userType);
              this.$session.set('serverName', resp.data.serverName);
              this.$session.set('usrMnuAtrt', resp.data.usrMnuAtrt);

              vm.$router.push('/dashboard/home');
            } else {
              alert('ID 혹은 비밀번호가 틀립니다');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    isValidated: function () {
      let chk = this.checkNotEmpty([
        ['EMP_ID', '아이디를 입력해 주세요.'],
        ['EMP_PWD', '비밀번호를 입력해 주세요.'],
      ]);
      return chk;
    },
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
    saveCookie: function (nm, id, day) {
      let today = new Date();
      today.setDate(today.getDate() + day);
      document.cookie =
        nm + '=' + id + '; path=/; expires=' + today.toGMTString() + ';';
    },
    getCookie: function (nm) {
      // userid 쿠키에서 id 값을 가져온다.
      var cook = document.cookie + ';';
      var idx = cook.indexOf(nm, 0);
      var val = '';

      if (idx != -1) {
        cook = cook.substring(idx, cook.length);
        let begin = cook.indexOf('=', 0) + 1;
        let end = cook.indexOf(';', begin);
        val = unescape(cook.substring(begin, end));
      }
      return val;
    },
  },
};
</script>

<style>
.member_info > .id_save {
  font-size: 15px;
}
#login-logo {
  width: 300px;
  margin-bottom: 50px;
}
#cb_saveId {
  vertical-align: baseline;
  margin-right: 5px;
}
</style>
