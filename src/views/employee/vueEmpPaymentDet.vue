<template v-if="cntempOnelist != 0">
  <p class="conTitle">
    <span>개인 급여 지급 내역 조회</span>
    <span class="fr" style="float: left; margin-bottom: 5px">
      사번
      <input
        type="text"
        width="100px;"
        id="seno"
        name="seno"
        v-model="seno"
        style="text-align: center; font-weight: bold"
        readonly
      />
      &nbsp;사원명
      <input
        type="text"
        width="100px;"
        id="snm"
        name="snm"
        v-model="snm"
        style="text-align: center; font-weight: bold"
        readonly
      />
      &nbsp;부서명
      <input
        type="text"
        width="100px;"
        id="sdept"
        name="sdept"
        v-model="sdept"
        style="text-align: center; font-weight: bold"
        readonly
      />
      &nbsp;현재직급
      <input
        type="text"
        width="100px;"
        id="srank"
        name="srank"
        v-model="srank"
        style="text-align: center; font-weight: bold"
        readonly
      />
    </span>
  </p>

  <table class="col">
    <caption>
      caption
    </caption>
    <colgroup>
      <col width="10%" />
      <col width="10%" />
      <col width="10%" />
      <col width="10%" />
      <col width="10%" />

      <col width="10%" />
      <col width="10%" />
      <col width="10%" />
      <col width="10%" />
      <col width="10%" />
    </colgroup>

    <thead>
      <tr>
        <th scope="col">지급일</th>
        <th scope="col">연봉</th>
        <th scope="col">기본급</th>
        <th scope="col">국민연금</th>
        <th scope="col">건강보험</th>

        <th scope="col">산재보험</th>
        <th scope="col">고용보험</th>
        <th scope="col">소득세</th>
        <th scope="col">비고금액</th>
        <th scope="col">실급여</th>
      </tr>
    </thead>
    <template v-if="totalCnt == 0">
      <tbody>
        <tr>
          <td colspan="10">데이터가 존재하지 않습니다.</td>
        </tr>
      </tbody>
    </template>
    <template v-else>
      <tbody v-for="(list, index) in empOnelist" :key="index">
        <tr>
          <td>{{ list.onedate }}</td>
          <td>{{ $comma(list.oneypay) }}</td>
          <td>{{ $comma(list.onempay) }}</td>
          <td>{{ $comma(list.onenins) }}</td>
          <td>{{ $comma(list.onehins) }}</td>
          <td>{{ $comma(list.oneeins) }}</td>
          <td>{{ $comma(list.oneiins) }}</td>
          <td>{{ $comma(list.onetax) }}</td>
          <td>{{ $comma(list.oneextra) }}</td>
          <td>{{ $comma(list.onerpay) }} 원</td>
        </tr>
      </tbody>
    </template>
  </table>
  <div>
    <paginate
      class="justify-content-center"
      v-model="currentPage"
      :page-count="totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="clickCallback"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate-next';
// import { vuecombiListAxios } from '../system';

export default {
  props: { sloginID: String },
  watch: {
    sloginID() {
      this.loginID = this.sloginID;
      this.searchemp();
    },
  },
  mounted() {
    this.loginID = this.sloginID;
    this.searchemp();
  },
  data: function () {
    return {
      //초기화면 리스트
      empOnelist: [],

      //pageinate 설정
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0,
      grdNo: 1,
      cpage: 1,

      seno: '',
      snm: '',
      sdept: '',
      srank: '',

      loginID: '',

      btnSearch: '',
    };
  },
  computed: {},
  components: {
    paginate: Paginate,
  },

  methods: {
    //화면초기
    searchemp: function () {
      let vm = this;
      let params = new URLSearchParams();

      params.append('pageSize', this.pageSize);
      params.append('sloginID', this.loginID);
      params.append('cpage', this.cpage);

      this.$vuecombiListAxios('/employee/vueEmpOneList.do', params).then(
        function (response) {
          //console.log('searchemp response' + JSON.stringify(response));

          vm.seno = response.data.empOnelist[0].oneeno;
          vm.snm = response.data.empOnelist[0].onenm;
          vm.sdept = response.data.empOnelist[0].onedept;
          vm.srank = response.data.empOnelist[0].onerank;

          //paginate 설정
          vm.totalCnt = response.data.cntempOnelist;
          vm.empOnelist = response.data.empOnelist;
          //page를 전역변수 사용
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
          //vm.totalPage = vm.page();

          vm.currentPage == 1
            ? (vm.grdNo = 1)
            : (vm.grdNo = 5 * (vm.currentPage - 1) + 1);

          for (let value of vm.empOnelist) {
            value.indexNew = vm.grdNo++;
          }
        }
      );
    },

    //paginate callback
    clickCallback: function (pageNum) {
      console.log(pageNum);

      this.currentPage = pageNum;
      //this.Paginate.pageNum = 10;
      this.searchemp();
    },
  },
};
</script>
<style>
.black-bg {
  width: 100%;
  height: 100%;
  background: rgba(201, 204, 22, 0.5);
  position: fixed;
  padding: 20px;
}

.white-bg {
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 8px;
}
</style>
