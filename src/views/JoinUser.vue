<template>
  <div id="layer1" class="layerType2" style="width: 600px">
    <form id="RegisterForm" action="" method="post">
      <input type="hidden" name="action" id="action" value="" />
      <input type="hidden" name="ckIdcheckreg" id="ckIdcheckreg" value="0" />
      <input
        type="hidden"
        name="ckEmailcheckreg"
        id="ckEmailcheckreg"
        value="0"
      />
      <dl>
        <dt>
          <br />
          <br />
          <strong style="font-size: 120%"
            >&nbsp;&nbsp;&nbsp;&nbsp;회원가입</strong
          >
          <br />
        </dt>
        <dd class="content">
          <!-- s : 여기에 내용입력 -->
          <table class="row">
            <caption>
              caption
            </caption>
            <colgroup>
              <col width="120px" />
              <col width="*" />
              <col width="120px" />
              <col width="*" />
              <col width="120px" />
            </colgroup>
            <tbody>
              <tr class="hidden">
                <td><input type="text" name="user_type" id="user_type" /></td>
                <td>
                  <input
                    type="hidden"
                    name="status_cd"
                    id="status_cd"
                    value=""
                  />
                </td>
                <td>
                  <input type="hidden" name="rank_cd" id="rank_cd" value="" />
                </td>
              </tr>

              <tr>
                <th scope="row">아이디<span class="font_red">*</span></th>
                <td colspan="2">
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="loginID"
                    placeholder="숫자, 영문자 조합으로 6~20자리 "
                    id="registerId"
                    v-model="registerId"
                    ref="refid"
                  />
                </td>
                <td>
                  <input
                    type="button"
                    value="중복확인"
                    @click="loginIdCheckComplete()"
                    style="width: 130px; height: 20px"
                    ref="refidcheck"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">비밀번호 <span class="font_red">*</span></th>
                <td colspan="3">
                  <input
                    type="password"
                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리 "
                    class="inputTxt p100"
                    name="password"
                    id="registerPwd"
                    v-model="password"
                    ref="refpassword"
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" style="padding: 0 0">
                  비밀번호 확인<span class="font_red">*</span>
                </th>
                <td colspan="3">
                  <input
                    type="password"
                    class="inputTxt p100"
                    name="password1"
                    id="registerPwdOk"
                    v-model="password1"
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" id="registerName_th">
                  이름 <span class="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="name"
                    id="registerName"
                    v-model="name"
                  />
                </td>

                <th scope="row" id="rggender_th">
                  성별<span class="font_red">*</span>
                </th>
                <td id="rggender_td">
                  <select
                    id="sex"
                    name="sex"
                    v-model="sex"
                    style="width: 128px; height: 28px"
                  >
                    <option value="" selected>선택</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </td>
              </tr>

              <tr id="birthday1">
                <th scope="row">
                  생년월일 <span class="font_red">*</span
                  ><span class="font_red"></span>
                </th>
                <td>
                  <input
                    type="date"
                    class="inputTxt p100"
                    name="birthday"
                    id="birthday"
                    v-model="birthday"
                    style="font-size: 15px"
                  />
                </td>
                <th scope="row">
                  최종학력 <span class="font_red">*</span
                  ><span class="font_red"></span>
                </th>
                <td>
                  <ComCombo
                    group_code="school_cd"
                    selectid="schoolname"
                    name="detSchoolCd"
                    id="detSchoolCd"
                    type="sel"
                    selvalue=""
                    eventid="selectSchool"
                    v-model="detSchoolCd"
                    style="width: 100px; height: 20px"
                    ref="Com_combo"
                  ></ComCombo>
                </td>
              </tr>
              <tr>
                <th scope="row">이메일<span class="font_red">*</span></th>
                <td colspan="3">
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="email"
                    id="registerEmail"
                    v-model="email"
                    ref="refemail"
                  />
                </td>

                <td colspan="3"></td>
              </tr>
              <tr>
                <th scope="row">우편번호<span class="font_red">*</span></th>
                <td colspan="2">
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="user_zipcode"
                    id="detailaddr"
                    v-model="user_zipcode"
                  />
                </td>

                <td>
                  <input
                    type="button"
                    value="우편번호 찾기"
                    @click="DaumPostcode()"
                    style="width: 130px; height: 20px"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">주소<span class="font_red">*</span></th>
                <td colspan="3">
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="user_address"
                    id="loginaddr"
                    v-model="user_address"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">상세주소</th>
                <td colspan="3">
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="user_dt_address"
                    id="loginaddr1"
                    v-model="user_dt_address"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">전화번호<span class="font_red">*</span></th>
                <td colspan="3">
                  <select
                    name="tel1"
                    id="tel1"
                    style="width: 30%"
                    v-model="tel1"
                    ref="reftel1"
                  >
                    <option value="" selected>선택</option>
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="02">02</option>
                  </select>
                  -
                  <input
                    class="inputTxt"
                    style="width: 28%"
                    maxlength="4"
                    type="text"
                    id="tel2"
                    name="tel2"
                    v-model="tel2"
                    ref="reftel2"
                  />
                  -
                  <input
                    class="inputTxt"
                    style="width: 28%"
                    maxlength="4"
                    type="text"
                    id="tel3"
                    name="tel3"
                    v-model="tel3"
                    ref="reftel3"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">은행계좌<span class="font_red">*</span></th>
                <td colspan="3">
                  <ComCombo
                    group_code="bank_cd"
                    selectid="bankname"
                    type="sel"
                    name="detBankCd"
                    id="detBankCd"
                    selvalue=""
                    eventid="selectBank"
                    v-model="detBankCd"
                    style="width: 100px; height: 20px"
                    ref="Com_combo"
                  ></ComCombo>
                  <input
                    class="inputTxt"
                    type="text"
                    id="account"
                    name="account"
                    style="width: 70%"
                    v-model="account"
                    ref="refaccount"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="btn_areaC mt30">
            <a
              href=""
              @click.prevent="completeBtnClick()"
              class="btnType blue"
              id="RegisterCom"
              name="btn"
            >
              <span>회원가입 완료</span></a
            >
            <a
              href=""
              class="btnType gray"
              id="btnCloseLsmCod"
              name="btn"
              @click.prevent="close()"
              ><span>취소</span></a
            >
          </div>
        </dd>
      </dl>
      <a href="" class="closePop" @click.prevent="close()"
        ><span class="hidden">닫기</span></a
      >
    </form>
  </div>
</template>
<script>
import ComCombo from '@/components/common/ComCombo.vue';
import DaumZipCode from '@/components/common/DaumZipCode.vue';
import { closeModal, pushModal, popModal } from 'jenesius-vue-modal';
export default {
  data() {
    return {
      action: 'I',
      user_zipcode: '',
      user_address: '',
      user_dt_address: '',

      registerId: '',
      checkId: '',
      password: '',
      password1: '',
      name: '',
      sex: '',
      birthday: '',
      detSchoolCd: '',
      email: '',

      tel1: '',
      tel2: '',
      tel3: '',
      detBankCd: '',
      account: '',
      ckIdcheckreg: '',
    };
  },
  components: {
    ComCombo,
  },

  methods: {
    /** 전역컴포넌트 다음 api 함수 */
    DaumPostcode: async function () {
      //다음 전역 컴포넌트 열기
      await pushModal(DaumZipCode);

      //컴포넌트 반환값 가져오기
      this.emitter.on('daumZipResult', (res) => {
        if (res) {
          this.user_zipcode = res.zonecode;

          // addressType이 R이면 도로명주소, 아니면 지번주소로 입력
          if (res.addressType == 'R') {
            this.user_address = res.roadAddress;
          } else {
            this.user_address = res.jibunAddress;
          }
          popModal();
        }
      });
    },

    validationCheck() {
      //빈값 체크
      let checkEmpName = this.$checkNotEmpty([
        ['registerId', '아이디를 입력해주세요.'],
        ['registerPwd', ' 비밀번호를 입력하세요.'],
        ['registerPwdOk', ' 비밀번호 확인을 입력하세요.'],
        ['registerName', ' 이름을 입력하세요.'],
        ['sex', ' 성별을 입력하세요.'],
        ['birthday', ' 생년월일을 입력하세요.'],
        ['detSchoolCd', ' 최종 학력을 입력하세요.'],
        ['registerEmail', ' 이메일을 입력하세요.'],

        ['detailaddr', '우편번호를 입력하세요.'],
        ['loginaddr', '주소를 입력하세요.'],
        ['loginaddr1', '상세주소를 입력하세요.'],
        ['tel1', '전화번호를 입력하세요.'],
        ['tel2', '전화번호를 입력하세요.'],
        ['tel3', '전화번호를 입력하세요.'],
        ['detBankCd', '은행을 선택하세요.'],
        ['account', '계좌번호를 입력하세요.'],
      ]);
      if (checkEmpName) {
        return checkEmpName;
      }
    },

    loginIdCheckComplete: function () {
      let params = new URLSearchParams();
      this.checkId = this.registerId;
      params.append('loginID', this.registerId);
      //let vm = this;
      this.$vuecombiListAxios('/check_loginID.do', params).then((response) => {
        if (this.registerId == '') {
          alert('아이디를 입력해주세요.');
          this.$refs.refid.focus();
          this.ckIdcheckreg = 0;
          return false;
        } else if (response.data == 1) {
          alert('중복된 아이디가 존재합니다.');
          this.$refs.refid.focus();
          this.ckIdcheckreg = 0;
          return false;
        } else if (response.data == 0) {
          alert('사용할 수 있는 아이디 입니다.');
          this.ckIdcheckreg = 1;
          return true;
        }
      });
    },

    completeBtnClick: function () {
      // if (this.validationCheck()) {
      //   this.CompleteRegister();
      // }
      if (this.checkId == this.registerId) {
        this.CompleteRegister();
      } else {
        alert('아이디 중복확인을 진행해주세요.');
        return;
      }
    },

    CompleteRegister: function () {
      //아이디 정규식
      const idRules = /^[a-z0-9]{6,20}$/g;
      //이메일 정규식
      const emailRules =
        /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/;
      //패스워드 정규식
      const passwordRules =
        /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
      //전화번호 정규식
      const tel1Rules = /^\d{2,3}$/;
      const tel2Rules = /^\d{3,4}$/;
      const tel3Rules = /^\d{4}$/;
      //계좌번호 정규식
      const accountRules = /^\d{0,20}$/;
      //if (this.loginIdCheckComplete()) {
      //this.loginIdCheckComplete();

      if (!idRules.test(this.registerId)) {
        alert('아이디는 숫자,영문자 조합으로 6~20자리를 사용해야 합니다.');
        this.$refs.refid.focus();
      } else if (!passwordRules.test(this.password)) {
        alert(
          '비밀 번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.'
        );
        this.$refs.refpassword.focus();
      } else if (this.ckIdcheckreg == 0) {
        alert('아이디 중복확인을 진행해주세요.');
        this.$refs.refid.focus();
      } else if (this.password != this.password1) {
        alert('비밀번호가 맞지 않습니다.');
        this.$refs.refpassword.focus();
      } else if (!emailRules.test(this.email)) {
        alert('이메일 형식을 확인해주세요.');
        this.$refs.refemail.focus();
      } else if (!tel1Rules.test(this.tel1)) {
        alert('전화번호를 확인해주세요.');
        this.$refs.reftel1.focus();
      } else if (!tel2Rules.test(this.tel2)) {
        alert('전화번호를 확인해주세요.');
        this.$refs.reftel2.focus();
      } else if (!tel3Rules.test(this.tel3)) {
        alert('전화번호를 확인해주세요.');
        this.$refs.reftel3.focus();
      } else if (!accountRules.test(this.account)) {
        alert('계좌번호는 숫자만 입력 가능합니다.');
        this.$refs.refaccount.focus();
        return false;
      } else {
        let result = confirm('회원가입 하시겠습니까?');
        if (result) {
          let params = new URLSearchParams();
          params.append('action', this.action);
          params.append('loginID', this.registerId);
          params.append('password', this.password);
          params.append('name', this.name);
          params.append('sex', this.sex);
          params.append('birthday', this.birthday);
          params.append('email', this.email);
          params.append('user_zipcode', this.user_zipcode);
          params.append('user_address', this.user_address);
          params.append('user_dt_address', this.user_dt_address);
          params.append('tel1', this.tel1);
          params.append('tel2', this.tel2);
          params.append('tel3', this.tel3);
          params.append('school_cd', this.detSchoolCd);
          params.append('bank_cd', this.detBankCd);
          params.append('account', this.account);
          params.append('user_type', 'D');

          //let vm = this;
          this.$vuecombiListAxios('/register.do', params).then(function (res) {
            if (res.data.result == 'SUCCESS') {
              alert('회원가입이 완료되었습니다.');
              closeModal();
            } else {
              alert('회원가입에 실패하였습니다.');
            }
          });
        }
        //}
      }
    },
    close: function () {
      closeModal(this);
    },
  },
};
</script>
