<template>
  <div id="rest_reg" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>근태 신청</strong>
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
          </colgroup>

          <tbody>
            <tr>
              <th scope="row">근무부서 <span class="font_red"></span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="Mdept_name"
                  readonly
                />
              </td>
              <th scope="row">근태종류 <span class="font_red"></span></th>
              <td>
                <select
                  id="rest_cd"
                  name="rest_cd"
                  size="1"
                  class="check"
                  v-model="rest_cd"
                >
                  <option value="">근태종류</option>
                  <option value="1">월차</option>
                  <option value="2">연차</option>
                </select>
              </td>
            </tr>
            <tr>
              <th scope="row">성명<span class="font_red"></span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="MloginName"
                  readonly
                />
              </td>
              <th scope="row">사원번호<span class="font_red"></span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="Memp_num"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">기간 <span class="font_red">*</span></th>
              <td colspan="3">
                일자<input
                  type="date"
                  id="st_date"
                  name="st_date"
                  v-model="st_date"
                />
                ~
                <input
                  type="date"
                  id="ed_date"
                  name="ed_date"
                  v-model="ed_date"
                />
              </td>
            </tr>

            <tr>
              <th scope="row">휴가사유<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="rest_rsn"
                  id="rest_rsn"
                  v-model="rest_rsn"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">연락처<span class="font_red"></span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  id="rest_hp"
                  name="rest_hp"
                  v-model="Mhp"
                  readonly
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="saveBtnClick()"
            class="btnType blue"
            id="btnSave"
            name="btn"
            ><span>신청</span></a
          >
          <a
            href=""
            @click.prevent="close()"
            class="btnType gray"
            id="btnClose"
            name="btn"
            ><span>닫기</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" @click.prevent="close()" class="closePop"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';
export default {
  props: {
    dept_name: String,
    loginName: String,
    emp_num: Number,
    hp: String,
  },
  data: function () {
    return {
      Mdept_name: '',
      MloginName: '',
      Memp_num: '',
      Mhp: '',

      rest_cd: '',
      st_date: '',
      ed_date: '',
      rest_rsn: '',
    };
  },
  mounted() {
    this.Mdept_name = this.dept_name;
    this.MloginName = this.loginName;
    this.Memp_num = this.emp_num;
    this.Mhp = this.hp;
  },
  methods: {
    saveBtnClick: function () {
      if (this.validationCheck()) {
        this.dateValCheck();
      }
    },

    validationCheck() {
      let checkEmpName = this.$checkNotEmpty([
        ['rest_cd', '근태종류를 선택해주세요'],
        ['st_date', '휴가 시작일을 선택해주세요'],
        ['ed_date', '휴가 종료일을 선택해주세요'],
        ['rest_rsn', '휴가사유를 입력해주세요'],
      ]);
      if (checkEmpName) {
        return checkEmpName;
      }
    },

    dateValCheck: function () {
      const checkDate = this.$checkStartEndDate(this.st_date, this.ed_date);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.ed_date = '';
        return false;
      }
      //this.searchKey = 'Z';
      //this.modalSave();
      this.checkToday();
    },

    getToday: function () {
      let date = new Date();
      let year = date.getFullYear();
      let month = ('0' + (1 + date.getMonth())).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      return year + '-' + month + '-' + day;
    },

    checkToday: function () {
      if (this.st_date < this.getToday()) {
        alert('신청 날짜가 오늘 이전이 될 수 없습니다.');
        return false;
      }
      this.modalSave();
    },

    modalSave: function () {
      let params = new URLSearchParams(); //백단에 데이터를 보내기 위해 생성자를 만듦
      params.append('rest_cd', this.rest_cd);
      params.append('st_date', this.st_date);
      params.append('ed_date', this.ed_date);
      params.append('rest_rsn', this.rest_rsn);
      this.$vuecombiListAxios('/employee/taApplysave.do', params).then(
        (response) => {
          if (response.data.result == 'SUCCESS') {
            alert('신청되었습니다!');
          } else {
            alert('오류...');
          }
          this.close();
        }
      );
    },
    close: function () {
      closeModal();
    },
  },
};
</script>
