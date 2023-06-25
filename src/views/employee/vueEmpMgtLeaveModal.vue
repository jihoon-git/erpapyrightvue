<template>
  <div id="leaveEmp" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>휴직처리</strong>
      </dt>
      <dd class="content">
        <table class="row">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="50%" />
            <col width="10%" />
            <col width="50%" />
            <col width="10%" />
          </colgroup>

          <tbody>
            <tr>
              <th scope="row">사번</th>
              <td>
                <input
                  type="text"
                  class="inputTxt"
                  id="leaveEmpNo"
                  v-model="leaveEmpNo"
                  name="leaveEmpNo"
                  readonly
                />
                <input
                  type="hidden"
                  class="inputTxt"
                  id="leaveLoginID"
                  v-model="leaveLoginID"
                  name="leaveLoginID"
                />
                <input
                  type="hidden"
                  name="leaveJoinDate"
                  id="leaveJoinDate"
                  v-model="leaveJoinDate"
                />
              </td>
              <th scope="row">사원명</th>
              <td>
                <input
                  type="text"
                  class="inputTxt"
                  id="leaveName"
                  v-model="leaveName"
                  name="leaveName"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">휴직시작일<span class="font_red">*</span></th>
              <td>
                <input
                  type="date"
                  id="leaveStartDate"
                  style="width: 90%; height: 80%"
                  v-model="leaveStartDate"
                  @change="fn_leaveStJo"
                />
              </td>
              <th scope="row">휴직종료일<span class="font_red">*</span></th>
              <td>
                <input
                  type="date"
                  id="leaveEndDate"
                  style="width: 90%; height: 80%"
                  v-model="leaveEndDate"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="leaveBtnClick()"
            class="btnType blue"
            id="btnEmpOut"
            ><span>휴직처리</span></a
          >
          <a href="" @click.prevent="close()" class="btnType gray" id="btnClose"
            ><span>취소</span></a
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
    loginID: String,
    emp_no: Number,
    name: String,
    st_date: String,
  },
  data: function () {
    return {
      leaveEmpNo: '',
      leaveLoginID: '',
      leaveJoinDate: '',
      leaveName: '',

      leaveStartDate: '',
      leaveEndDate: '',
    };
  },
  mounted() {
    this.leaveEmpNo = this.emp_no;
    this.leaveLoginID = this.loginID;
    this.leaveJoinDate = this.st_date;
    this.leaveName = this.name;
  },
  methods: {
    leaveBtnClick: function () {
      if (this.validationCheck()) {
        this.dateValCheck();
      }
    },

    validationCheck() {
      let checkEmpName = this.$checkNotEmpty([
        ['leaveStartDate', '휴직 시작일을 입력해주세요.'],
        ['leaveEndDate', '휴직 종료일을 입력해주세요.'],
      ]);
      if (checkEmpName) {
        return checkEmpName;
      }
    },

    dateValCheck: function () {
      const checkDate = this.$checkStartEndDate(
        this.leaveStartDate,
        this.leaveEndDate
      );
      if (!checkDate) {
        this.ed_date = '';
        return false;
      }
      this.fnLeaveEmp();
    },

    fnLeaveEmp: function () {
      let params = new URLSearchParams();
      params.append('loginID', this.leaveLoginID);
      params.append('lvst_date', this.leaveStartDate);
      params.append('lved_date', this.leaveEndDate);
      let result = confirm('휴직 처리 하시겠습니까?');
      if (result) {
        this.$vuecombiListAxios('/employee/leaveEmp.do', params).then(
          (response) => {
            if (response.data.result == 'SUCCESS') {
              alert(response.data.resultMsg);
            }

            this.close();
          }
        );
      } else {
        alert('휴직처리에 실패하였습니다.');
      }
    },
    close: function () {
      closeModal();
    },
  },
};
</script>
