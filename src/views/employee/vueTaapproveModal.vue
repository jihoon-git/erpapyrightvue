<template>
  <div class="layerType2" style="width: 800px; height: 800px">
    <dl>
      <dt>
        <strong>근태신청</strong>
      </dt>
      <dd
        class="content"
        style="width: 740px; height: 500px; padding-bottom: 0px"
      >
        <table class="col" style="background-color: rgb(220, 225, 230)">
          <colgroup>
            <col width="20%" />
            <col width="30%" />
            <col width="20%" />
            <col width="30%" />
          </colgroup>
          <h1 class="center title">휴가 신청서</h1>
          <thead class="middle">
            <tr>
              <th scope="col">근무부서</th>
              <td scope="col" style="padding: 0px; width: 200px">
                <input
                  style="
                    width: 200px;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    display: block;
                    margin: 0 auto;
                  "
                  type="text"
                  v-model="deptcd"
                  readonly
                />
              </td>
              <th scope="col">근태종류</th>
              <td
                scope="col"
                class="center"
                style="
                  width: 200px;
                  height: 30px;
                  padding: 0px;
                  text-align: center;
                  display: block;
                  margin: 0 auto;
                "
              >
                <input
                  style="
                    width: 200px;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    display: block;
                    margin: 0 auto;
                  "
                  type="text"
                  v-model="rest_cd"
                  readonly
                />
              </td>
            </tr>

            <tr class="left">
              <th scope="col">성명</th>
              <td scope="col" style="padding: 0px; width: 200px">
                <input
                  style="
                    width: 200px;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    display: block;
                    margin: 0 auto;
                  "
                  type="text"
                  v-model="empnamepop"
                  readonly
                />
              </td>
            </tr>
            <tr style="margin-bottom: 20px">
              <th scope="col">사번</th>
              <td scope="col" style="padding: 0px; width: 200px">
                <input
                  style="
                    width: 200px;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    display: block;
                    margin: 0 auto;
                  "
                  type="text"
                  v-model="empnopop"
                  readonly
                />
              </td>
            </tr>
            <tr style="margin-bottom: 20px">
              <th scope="col">비상연락처</th>
              <td scope="col" style="padding: 0px; width: 200px">
                <input
                  style="
                    width: 200px;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    display: block;
                    margin: 0 auto;
                  "
                  type="text"
                  v-model="tell"
                  readonly
                />
              </td>
            </tr>
          </thead>
        </table>

        <table class="col" style="background-color: rgb(220, 225, 230)">
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <thead>
            <tr scope="col">
              <th scope="col">기간</th>
              <td scope="col">
                <span
                  style="
                    position: relative;
                    width: 100%;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    display: block;
                    margin: 0 auto;
                  "
                >
                  <input
                    type="text"
                    v-model="st_date"
                    class="hei"
                    readonly
                  />~<input
                    type="text"
                    v-model="ed_date"
                    class="hei"
                    readonly
                  />
                </span>
              </td>
            </tr>
            <tr scope="col" style="height: 100px">
              <th scope="col">휴가사유</th>
              <td style="" class="center">
                <input
                  type="text"
                  style="
                    height: 100px;
                    margin: 6px 9.5px 6px 9.5px;
                    width: 100%;
                  "
                  v-model="rest_rsn"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="col"></th>
              <td class="center">
                <span style="font-size: 15px; padding-top: 10px"
                  >상기와 같은 사유로 휴가를 신청합니다.</span
                >
              </td>
            </tr>
            <tr>
              <th scope="col"></th>
              <td class="center">
                <span style="padding-top: 13px; font-size: 13px">신청일</span>
                <input
                  type="text"
                  style="height: 30px; margin: 6px 9.5px 6px 9.5px; width: 50%"
                  v-model="app_date"
                  readonly
                />
              </td>
            </tr>
          </thead>
        </table>

        <table class="col" style="background-color: rgb(220, 225, 230)">
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="row">승인구분 <span class="font_red">*</span></th>
              <td colspan="3" style="padding-left: 10px; font-size: 13px">
                <div v-for="(list, index) in radiolistitem" :key="index">
                  <input
                    type="radio"
                    :value="list.key"
                    v-model="checked"
                    :checked="this.atd_yn"
                    :disabled="this.atd_yn"
                  />
                  <label :for="list.key" class="text">{{ list.value }}</label>
                </div>
              </td>
            </tr>

            <tr
              scope="col"
              style="height: 100px"
              v-show="checked == 'n' ? true : false"
            >
              <th scope="col">반려사유</th>
              <td style="" class="center">
                <input
                  type="text"
                  style="
                    height: 100px;
                    margin: 6px 9.5px 6px 9.5px;
                    width: 100%;
                  "
                  v-model="reject_rsn"
                  :disabled="this.atd_yn"
                />
              </td>
            </tr>
          </thead>
        </table>
      </dd>
    </dl>

    <a href="" class="closePop" @click.prevent="modalClose"
      ><span class="hidden">닫기</span></a
    >

    <div class="btn_areaC mt20" style="position: absolute; bottom: 20px">
      <a
        href=""
        class="btnType blue"
        @click.prevent="fn_update"
        v-if="!this.atd_yn"
        ><span>확인</span></a
      >
      <a href="" class="btnType blue" @click.prevent="modalClose"
        ><span>닫기</span></a
      >
    </div>
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';
export default {
  props: { receive_atd_no: Number, receive_atd_yn: Boolean },
  data: function () {
    return {
      listTaapprove: [],

      //props에서 받음.
      atd_no: 0,
      atd_yn: false,

      deptcd: 0,
      rest_cd: 0,
      empnamepop: '',
      empnopop: 0,
      tell: '',
      st_date: '',
      ed_date: '',
      rest_rsn: '',
      app_date: '',
      atd_radio_yn: '',
      reject_rsn: '',

      radiolistitem: [
        { key: 'n', value: '반려' },
        { key: 'y', value: '승인' },
      ],
      checked: '',

      //반려사유 v-show
      re_reasonflag: '',
    };
  },
  created() {
    this.atd_no = this.receive_atd_no;
    this.atd_yn = this.receive_atd_yn;
    console.log('created atd_no ' + this.atd_no);
    console.log('created atd_yn ' + this.atd_yn);
  },
  mounted() {
    this.fn_detailone();
  },

  methods: {
    fn_detailone: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('atd_no', this.atd_no);
      this.$vuecombiListAxios('/employee/detailone.do', params).then(function (
        response
      ) {
        console.log('fn_detailone response' + JSON.stringify(response));
        vm.empnopop = response.data.detailone.empnopop;
        vm.empnamepop = response.data.detailone.empnamepop;
        vm.rest_cd = response.data.detailone.rest_cd;
        vm.rest_rsn = response.data.detailone.rest_rsn;
        vm.reject_rsn = response.data.detailone.reject_rsn;
        vm.app_date = response.data.detailone.app_date;

        vm.st_date = response.data.detailone.st_date;
        vm.ed_date = response.data.detailone.ed_date;
        //vm.rest_day = response.data.detailone.rest_day;
        vm.checked = response.data.detailone.atd_yn;
        vm.deptcd = response.data.detailone.deptcd;
        vm.tell = response.data.detailone.tell;
      });
    },
    fn_update: function () {
      //let vm = this;
      let params = new URLSearchParams();
      params.append('atd_no', this.atd_no);
      params.append('atd_yn', this.checked);
      params.append('reject_rsn', this.reject_rsn);
      params.append('action', 'U');
      params.append('name', this.empnamepop);
      params.append('atd_no', this.atd_no);
      this.$vuecombiListAxios('/employee/taapproveupdate.do', params).then();
      closeModal();
    },
    modalClose: function () {
      closeModal();
    },
  },
};
</script>
