<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>

    <span class="btn_nav bold">인사·급여</span>
    <span class="btn_nav bold">승진내역 관리</span>
    <a href="../employee/empGrade.do" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>승진내역 조회</span>
  </p>
  <p class="">
    <span class="fr">
      <span>부서</span>&nbsp;
      <ComCombo
        group_code="dept_cd"
        selectid="deptname"
        type="all"
        selvalue=""
        eventid="selectDept"
        v-model="deptname"
        style="width: 100px; height: 20px"
        ref="Com_combo"
      ></ComCombo>

      <span>직급</span>&nbsp;
      <ComCombo
        group_code="rank_cd"
        selectid="srcrank"
        type="all"
        selvalue=""
        eventid="selectRank"
        v-model="srcrank"
        style="width: 100px; height: 20px"
        ref="Com_combo"
      ></ComCombo>

      사번 &nbsp;
      <input
        type="text"
        id="srcempno"
        name="srcempno"
        v-model="srcempno"
        style="width: 100px; height: 20px"
      />
      발령일자 &nbsp;
      <input
        type="date"
        id="srcsdate"
        name="srcsdate"
        v-model="srcsdate"
        style="height: 20px"
      />
      ~
      <input
        type="date"
        id="srcedate"
        name="srcedate"
        v-model="srcedate"
        style="height: 20px"
      />&nbsp;&nbsp;

      <a
        class="btnType blue"
        href=""
        id="btnSearch"
        name="btn"
        @click.prevent="schPromotion()"
        ><span>검색</span></a
      >
    </span>
  </p>
  <br /><br />

  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="15%" />
        <col width="15%" />
        <col width="25%" />
        <col width="25%" />
        <col width="20%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">사번</th>
          <th scope="col">사원명</th>
          <th scope="col">부서명</th>
          <th scope="col">직급</th>
          <th scope="col">발령일자</th>
        </tr>
      </thead>

      <template v-if="egradelistcnt == 0">
        <tbody>
          <tr>
            <td colspan="5">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>

      <template v-else>
        <tbody v-for="(list, item) in egradelist" :key="item" id="listEmpGrade">
          <tr>
            <td>{{ list.emp_no }}</td>
            <td>
              <a
                href=""
                @click.prevent="
                  vuefn_detailempgrade(list.loginID, list.rank_cd)
                "
                >{{ list.name }}</a
              >
            </td>
            <td>{{ list.deptname }}</td>
            <td>{{ list.rankname }}</td>
            <td>{{ list.prmtn_date }}</td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
  <!-- 페이징 처리  -->
  <div id="resPagination">
    <Paginate
      class="justify-content-center"
      v-model="cpage"
      :page-count="totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="searchempgrade"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </Paginate>
  </div>
  <br />
  <vueEmpGradeDet
    v-if="btnSearch == 's'"
    :empNameDet="empId"
    :rankname="rankname"
  ></vueEmpGradeDet>
</template>

<script>
import ComCombo from '@/components/common/ComCombo.vue';
import Paginate from 'vuejs-paginate-next';
import vueEmpGradeDet from './vueEmpGradeDet.vue';

export default {
  data: function () {
    return {
      pageSize: 5,
      pageBlockSize: 5,
      egradelist: [],
      egradelistcnt: '',
      empGradePagination: '',
      detailEmpPagination: '',
      empDetailshow: '',
      dpageSize: 5,
      dpageBlockSize: 5,
      detailgrade: [],
      detailcnt: '',
      action: '',
      searchKey: '',

      empId: '',
      emp_no: '',
      empName: '',
      name: '',
      deptname: '',
      rankname: '',

      srcdetp: '',
      srcrank: '',
      srcempno: '',
      srcsdate: '',
      srcedate: '',

      btnSearch: '',
    };
  },
  components: {
    Paginate: Paginate,
    vueEmpGradeDet,
    ComCombo,
  },
  unmounted() {
    this.emitter.off('selectDept');
    this.emitter.off('selectRank');
  },

  mounted() {
    this.searchempgrade();
  },
  methods: {
    bclick: function () {
      this.emitter.emit('selectDept', this.selectDept);
      this.emitter.emit('selectRank', this.selectRank);
    },
    schPromotion: function () {
      this.searchKey = '';

      const checkNumber = this.$checkEmpNumber(this.srcempno);
      if (!checkNumber) {
        this.srcempno = '';
        return false;
      }

      const checkDate = this.$checkStartEndDate(this.srcsdate, this.srcedate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.srcedate = '';
        return false;
      }
      this.searchKey = 'Z';
      this.searchempgrade();
    },
    searchempgrade: function (cpage) {
      this.btnSearch = '';
      this.cpage = cpage || 1;
      let vm = this;
      let param = new URLSearchParams();

      if (this.searchKey == 'Z') {
        param.append('pageSize', this.pageSize);
        param.append('cpage', this.cpage);
        param.append('srcdetp', this.deptname);
        param.append('srcrank', this.srcrank);
        param.append('srcempno', this.srcempno);
        param.append('srcsdate', this.srcsdate);
        param.append('srcedate', this.srcedate);
      } else {
        param.append('pageSize', this.pageSize);
        param.append('cpage', this.cpage);
      }

      this.$vuecombiListAxios('/employee/vueEmpGradelist.do', param).then(
        function (res) {
          vm.egradelist = res.data.empGradelist;
          vm.egradelistcnt = res.data.countEmpgradelist;
          vm.totalPage = vm.$page(vm.egradelistcnt, vm.pageSize);
        }
      );
    },
    vuefn_detailempgrade: function (loginID, rankname) {
      this.btnSearch = 's';
      this.rankname = rankname;
      console.log('zzzzzzzzzzz : ' + this.btnSearch);
      this.empId = loginID;
      console.log('==================');
      console.log(loginID);
      console.log(this.empId);
    },
  },
};
</script>
