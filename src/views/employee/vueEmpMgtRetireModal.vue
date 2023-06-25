<template>
  <div id="retireEmp" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>퇴직처리</strong>
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
              <th scope="row">사번 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt"
                  id="retireEmpNo"
                  v-model="retireEmpNo"
                  name="retireEmpNo"
                  readonly
                />
                <input
                  type="hidden"
                  class="inputTxt"
                  id="retireLoginID"
                  v-model="retireLoginID"
                  name="retireLoginID"
                />
              </td>
              <th scope="row">사원명 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt"
                  id="retireName"
                  v-model="retireName"
                  name="retireName"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">입사일</th>
              <td>
                <input
                  type="date"
                  id="retireStDate"
                  v-model="retireStDate"
                  style="width: 90%; height: 80%"
                  readonly
                />
              </td>
              <th scope="row">퇴사일<span class="font_red">*</span></th>
              <td>
                <input
                  type="date"
                  id="retireEdDate"
                  v-model="retireEdDate"
                  style="width: 90%; height: 80%"
                  @change="fn_retireJo"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="retireBtnClick()"
            class="btnType blue"
            id="btnEmpOut"
            ><span>퇴직처리</span></a
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
      retireEmpNo: '',
      retireLoginID: '',
      retireStDate: '',
      retireName: '',

      retireEdDate: '',
    };
  },
  mounted() {
    this.retireEmpNo = this.emp_no;
    this.retireLoginID = this.loginID;
    this.retireStDate = this.st_date;
    this.retireName = this.name;
  },
  methods: {
    retireBtnClick: function () {
      if (this.validationCheck()) {
        this.fnRetireEmp();
      }
    },

    validationCheck() {
      let checkEmpName = this.$checkNotEmpty([
        ['retireEdDate', '퇴직일을 입력해주세요.'],
      ]);
      if (checkEmpName) {
        return checkEmpName;
      }
    },

    fnRetireEmp: function () {
      let params = new URLSearchParams();
      params.append('loginID', this.retireLoginID);
      params.append('ed_date', this.retireEdDate);
      let result = confirm('퇴직 처리 하시겠습니까?');
      if (result) {
        this.$vuecombiListAxios('/employee/retireEmp.do', params).then(
          (response) => {
            if (response.data.result == 'SUCCESS') {
              alert(response.data.resultMsg);
            }

            this.close();
          }
        );
      } else {
        alert('퇴직처리에 실패하였습니다.');
      }
    },
    close: function () {
      closeModal();
    },
  },
};
</script>
