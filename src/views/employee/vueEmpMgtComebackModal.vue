<template>
  <div id="comebackEmp" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>복직처리</strong>
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
                  id="comebackEmpNo"
                  v-model="comebackEmpNo"
                  name="comebackEmpNo"
                  readonly
                />
                <input
                  type="hidden"
                  class="inputTxt"
                  id="comebackLoginID"
                  v-model="comebackLoginID"
                  name="comebackLoginID"
                />
              </td>
              <th scope="row">사원명</th>
              <td>
                <input
                  type="text"
                  class="inputTxt"
                  id="comebackName"
                  v-model="comebackName"
                  name="comebackName"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">휴직시작일</th>
              <td>
                <input
                  type="date"
                  id="comebackStartDate"
                  v-model="comebackStartDate"
                  style="width: 90%; height: 80%"
                  readonly
                />
              </td>
              <th scope="row">휴직종료일</th>
              <td>
                <input
                  type="date"
                  id="comebackEndDate"
                  v-model="comebackEndDate"
                  style="width: 90%; height: 80%"
                  readonly
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="fnComebackEmp()"
            class="btnType blue"
            id="btnEmpOut"
            ><span>복직처리</span></a
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
    lvst_date: String,
    lved_date: String,
  },
  data: function () {
    return {
      comebackEmpNo: '',
      comebackLoginID: '',
      comebackName: '',
      comebackStartDate: '',
      comebackEndDate: '',
    };
  },
  mounted() {
    this.comebackEmpNo = this.emp_no;
    this.comebackName = this.name;
    this.comebackLoginID = this.loginID;
    this.comebackStartDate = this.lvst_date;
    this.comebackEndDate = this.lved_date;
  },
  methods: {
    fnComebackEmp: function () {
      let params = new URLSearchParams();
      params.append('loginID', this.comebackLoginID);
      let result = confirm('복직 처리 하시겠습니까?');
      if (result) {
        this.$vuecombiListAxios('/employee/comebackEmp.do', params).then(
          (response) => {
            if (response.data.result == 'SUCCESS') {
              alert(response.data.resultMsg);
            }

            this.close();
          }
        );
      } else {
        alert('복직처리에 실패하였습니다.');
      }
    },
    close: function () {
      closeModal();
    },
  },
};
</script>
