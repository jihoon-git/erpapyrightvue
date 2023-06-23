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
                  />
                </td>
                <td>
                  <input
                    type="button"
                    value="중복확인"
                    onclick="loginIdCheck()"
                    style="width: 130px; height: 20px"
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
                  />
                </td>

                <th scope="row" id="rggender_th">
                  성별<span class="font_red">*</span>
                </th>
                <td id="rggender_td">
                  <select
                    id="sex"
                    name="sex"
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
                    style="font-size: 15px"
                  />
                </td>
                <th scope="row">
                  최종학력 <span class="font_red">*</span
                  ><span class="font_red"></span>
                </th>
                <td>
                  <select
                    name="school_cd"
                    id="registerSchoolCd"
                    style="width: 128px; height: 28px"
                  ></select>
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
                  <select name="tel1" id="tel1" style="width: 30%">
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
                  />
                  -
                  <input
                    class="inputTxt"
                    style="width: 28%"
                    maxlength="4"
                    type="text"
                    id="tel3"
                    name="tel3"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">은행계좌<span class="font_red">*</span></th>
                <td colspan="3">
                  <select
                    id="registerBankCd"
                    name="bank_cd"
                    style="width: 30%"
                  ></select>
                  <input
                    class="inputTxt"
                    type="text"
                    id="account"
                    name="account"
                    style="width: 70%"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="btn_areaC mt30">
            <a
              href="javascript:CompleteRegister();"
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
import DaumZipCode from '@/components/common/DaumZipCode.vue';
import { closeModal, pushModal, popModal } from 'jenesius-vue-modal';
export default {
  data() {
    return {
      action: 'I',
      user_zipcode: '',
      user_address: '',
      user_dt_address: '',
    };
  },
  methods: {
    /** 전역컴포넌트 다음 api 함수 */
    DaumPostcode: async function () {
      //다음 전역 컴포넌트 열기
      await pushModal(DaumZipCode);

      //컴포넌트 반환값 가져오기
      this.emitter.on('daumZipResult', (res) => {
        if (res) {
          console.log(res);
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
    close: function () {
      closeModal(this);
    },
  },
};
</script>
