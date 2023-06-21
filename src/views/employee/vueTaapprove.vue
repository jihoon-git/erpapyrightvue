<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">인사/급여</span>
    <span class="btn_nav bold">근태 관리</span>
    <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
  </p>
  <p class="conTitle">
    <span>근태 관리</span>
  </p>
  <p class="conTitle">
    신청일자
    <input type="date" style="height: 20px; width: 120px" v-model="appsdate" />
    ~
    <input type="date" style="height: 20px; width: 120px" v-model="appedate" />
    사번
    <input type="text" style="height: 18px; width: 100px" v-model="empno" />
    &nbsp;&nbsp;&nbsp;&nbsp; 사원명
    <input type="text" style="height: 18px; width: 100px" v-model="empname" />
    &nbsp;&nbsp;&nbsp;&nbsp; 승인여부
    <select class="boxx" style="margin-right: 6%; width: 80px" v-model="atdyn">
      <option value="" selected>전체</option>
      <option value="y">승인</option>
      <option value="w">승인대기</option>
      <option value="n">반려</option>
    </select>
    <a class="btnType blue" href="" @click.prevent="schPromotion()"
      ><span>검색</span></a
    >
  </p>
  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="6%" />
        <col width="8%" />
        <col width="8%" />
        <col width="8%" />
        <col width="15%" />
        <col width="15%" />
        <col width="15%" />
        <col width="15%" />
        <col width="15%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">사번</th>
          <th scope="col">사원명</th>
          <th scope="col">신청구분</th>
          <th scope="col">시작일자</th>
          <th scope="col">종료일자</th>
          <th scope="col">신청일자</th>
          <th scope="col">승인자</th>
          <th scope="col">승인여부</th>
        </tr>
      </thead>
      <template v-if="counttaApprovelist == 0">
        <tbody>
          <tr>
            <td colspan="9">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr v-for="(list, index) in listTaapprove" :key="index">
            <td>{{ list.atd_no }}</td>
            <td>
              <a
                href=""
                @click.prevent="fn_detailone(list.atd_no, list.atd_yn)"
                >{{ list.empno }}</a
              >
            </td>
            <td>{{ list.empname }}</td>
            <td>{{ list.rest_cd }}</td>
            <td>{{ list.st_date }}</td>
            <td>{{ list.ed_date }}</td>
            <td>{{ list.app_date }}</td>
            <td>{{ list.atd_name }}</td>
            <td>{{ list.atd_yn }}</td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
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
import { openModal } from 'jenesius-vue-modal';
import Paginate from 'vuejs-paginate-next';
import vueTaapproveModal from './vueTaapproveModal.vue';
export default {
  data: function () {
    return {
      //초기화면 리스트
      listTaapprove: [],

      //pageinate 설정
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0, //데이터갯수
      grdNo: 1,

      appsdate: '',
      appedate: '',
      empno: '',
      empname: '',
      atdyn: '',

      //검색 클릭없이 검색되는것 막기 위해서
      searchKey: '',

      //승인여부 결과를 모달로 보냄
      result: false,
    };
  },
  mounted() {
    this.searchapprove();
  },
  computed: {},
  components: {
    paginate: Paginate,
  },
  methods: {
    schPromotion: function () {
      this.searchKey = '';

      const checkNumber = this.$checkEmpNumber(this.empno);
      if (!checkNumber) {
        this.empno = '';
        return false;
      }
      const checkName = this.$checkEmpName(this.empname);
      if (!checkName) {
        this.empname = '';
        return false;
      }
      const checkDate = this.$checkStartEndDate(this.srcsdate, this.srcedate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.srcedate = '';
        return false;
      }
      this.searchKey = 'Z';
      this.searchapprove();
    },

    searchapprove: function () {
      let vm = this;
      let params = new URLSearchParams();

      if (this.searchKey == 'Z') {
        params.append('appsdate', this.appsdate);
        params.append('appedate', this.appedate);

        params.append('empno', this.empno);
        params.append('empname', this.empname);
        params.append('atdyn', this.atdyn);

        params.append('pageSize', this.pageSize);
        params.append('cpage', this.currentPage);
      } else {
        params.append('pageSize', this.pageSize);
        params.append('cpage', this.currentPage);
      }
      this.$vuecombiListAxios('/employee/taapprovelistvue.do', params).then(
        function (response) {
          console.log('searchapprove response ' + JSON.stringify(response));
          vm.listTaapprove = response.data.taapprovelist; //수정
          vm.totalCnt = response.data.counttaApprovelist;
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);

          vm.currentPage == 1
            ? (vm.grdNo = 1)
            : (vm.grdNo = 5 * (vm.currentPage - 1) + 1);

          for (let value of vm.listTaapprove) {
            value.indexNew = vm.grdNo++;
          }
        }
      );
    },
    //전역변수로 page 설정. 데이터를 page로 나눠주는 역할. 이미 설정
    //paginate callback
    clickCallback: function (pageNum) {
      this.currentPage = pageNum;
      this.searchapprove();
    },
    //클릭시 상세페이지
    fn_detailone: async function (atd_no, atd_yn) {
      if (atd_yn == '승인대기') {
        this.result = false;
      } else {
        this.result = true;
      }
      let modal = await openModal(vueTaapproveModal, {
        receive_atd_no: atd_no,
        receive_atd_yn: this.result,
      });
      modal.onclose = () => {
        console.log('Close : ');
        this.searchapprove();
      };
    },
  },
};
</script>
