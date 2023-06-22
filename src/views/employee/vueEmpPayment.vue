<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">인사 급여</span>
    <span class="btn_nav bold">급여관리</span>
    <a href="..//system/comnCodMgr" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>급여 내역 조회</span>
  </p>
  <span class="fr" style="float: left; margin-bottom: 5px">
    부서
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
    &nbsp;직급
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
    &nbsp;사원명
    <input
      type="text"
      width="100px;"
      id="srcName"
      name="srcName"
      v-model="srcName"
    />
    &nbsp;지급상태
    <select name="srcyn" id="srcyn" style="width: 50px" v-model="srcyn">
      <option value>전체</option>
      <option value="y">완료</option>
      <option value="w">대기</option>
    </select>
    &nbsp;급여년월
    <input
      type="date"
      id="srcdate"
      name="srcdate"
      style="margin-right: 30px"
      v-model="srcdate"
    />
    <a class="btnType blue" href="" @click.prevent="btnEmpClick()"
      ><span>검색</span></a
    >
    <a
      class="btnType blue"
      href=""
      id="btnAllSave"
      name="btn"
      v-show="btnAllSave_show"
      @click.prevent="allSaveBtn()"
      ><span>일괄지급</span></a
    >
  </span>

  <div class="empSearchList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="7%" />
        <col width="6%" />
        <col width="6%" />
        <col width="6%" />
        <col width="6%" />

        <col width="8%" />
        <col width="8%" />
        <col width="7%" />
        <col width="7%" />
        <col width="7%" />

        <col width="7%" />
        <col width="6%" />
        <col width="7%" />
        <col width="6%" />
        <col width="6%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">지급년월</th>
          <th scope="col">부서</th>
          <th scope="col">직급</th>
          <th scope="col">사번</th>
          <th scope="col">사원명</th>

          <th scope="col">연봉</th>
          <th scope="col">기본급</th>
          <th scope="col">국민연금</th>
          <th scope="col">건강보험</th>
          <th scope="col">산재보험</th>

          <th scope="col">고용보험</th>
          <th scope="col">소득세</th>
          <th scope="col">비고금액</th>
          <th scope="col">실급여</th>
          <th scope="col">지급</th>
        </tr>
      </thead>
      <template v-if="totalCnt == 0">
        <tbody>
          <tr>
            <td colspan="15">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody v-for="(list, index) in empPaylist" :key="index">
          <tr @click="fn_oneemp(list.sloginID)">
            <td>{{ list.pay_date }}</td>
            <td>{{ list.dept }}</td>
            <td>{{ list.rank }}</td>
            <td>{{ list.emp_no }}</td>
            <td>{{ list.name }}</td>
            <td>{{ $comma(list.year_pay) }}</td>
            <td>{{ $comma(list.month_pay) }}</td>
            <td>{{ $comma(list.ins_n) }}</td>
            <td>{{ $comma(list.ins_h) }}</td>
            <td>{{ $comma(list.ins_i) }}</td>
            <td>{{ $comma(list.ins_e) }}</td>
            <td>{{ $comma(list.tax) }}</td>
            <td>{{ $comma(list.extra) }}</td>
            <td>{{ $comma(list.total) }} 원</td>
            <template v-if="list.pay_yn == 'y'">
              <td>지급완료</td>
            </template>
            <template v-else>
              <td>
                <a
                  style="color: red; font-weight: bold"
                  href=""
                  @click.prevent="
                    fn_loginsave(list.sloginID, list.salary_no, list.exp_no)
                  "
                  ><span>지급대기</span></a
                >
              </td>
            </template>
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

  <br />
  <br />

  <vueEmpPaymentDet
    v-if="btnSearch == 's'"
    :sloginID="sloginID"
  ></vueEmpPaymentDet>
</template>

<script>
import ComCombo from '@/components/common/ComCombo.vue';
import Paginate from 'vuejs-paginate-next';
import vueEmpPaymentDet from './vueEmpPaymentDet.vue';
// import { vuecombiListAxios } from '../system';

export default {
  mounted() {
    this.searchemp();
  },
  data: function () {
    return {
      //초기화면 리스트
      empPaylist: [],

      //pageinate 설정
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0,
      grdNo: 1,

      searchKey: '',

      //부서 검색
      clickEmp: '',
      deptname: '',
      srcrank: '',
      srcName: '',
      srcyn: '',
      srcdate: '',
      today: '',

      sloginID: '',

      btnSearch: '',

      //지급
      salary_no: '',
      exp_no: '',

      btnAllSave_show: true,
    };
  },
  computed: {},
  components: {
    vueEmpPaymentDet,
    ComCombo,
    paginate: Paginate,
  },

  methods: {
    getToday: function () {
      let date = new Date();
      let year = date.getFullYear();
      let month = ('0' + (1 + date.getMonth())).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      return year + '-' + month + '-' + day;
    },
    btnEmpClick: function () {
      const empnamecheck = this.$checkEmpName(this.srcName);
      if (!empnamecheck) {
        this.srcName = '';
        return false;
      }
      this.searchKey = 'Z';
      this.searchemp();
    },

    //화면초기
    searchemp: function () {
      let vm = this;
      let params = new URLSearchParams();

      if (this.searchKey == 'Z') {
        params.append('cpage', this.currentPage);
        params.append('pageSize', this.pageSize);
        params.append('srcrank', this.srcrank),
          params.append('srcdept', this.deptname),
          params.append('srcName', this.srcName),
          params.append('srcyn', this.srcyn),
          params.append('srcdate', this.srcdate),
          params.append('pageSize', this.pageSize);
      } else {
        params.append('cpage', this.currentPage);
        params.append('pageSize', this.pageSize);
      }

      this.$vuecombiListAxios('/employee/vueEmpPaylist.do', params).then(
        function (response) {
          console.log('searchemp response' + JSON.stringify(response));

          //paginate 설정
          vm.totalCnt = response.data.cntempPaylist;
          vm.empPaylist = response.data.empPaylist;
          //page를 전역변수 사용
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
          //vm.totalPage = vm.page();

          vm.currentPage == 1
            ? (vm.grdNo = 1)
            : (vm.grdNo = 5 * (vm.currentPage - 1) + 1);

          for (let value of vm.empPaylist) {
            value.indexNew = vm.grdNo++;
          }
        }
      );
    },
    //지급대기 버튼
    fn_loginsave: function (sloginID, salary_no, exp_no) {
      console.log('지급대기 버튼 실행');
      console.log('sloginID ' + sloginID);
      console.log('salary_no ' + salary_no);
      console.log('exp_no ' + exp_no);
      const saveOneQue = confirm('급여를 개별지급 하시겠습니까?');

      if (saveOneQue) {
        this.sloginID = sloginID;
        this.salary_no = salary_no;
        this.exp_no = exp_no;
        this.today = this.getToday();
        this.fn_onesave();
      }
    },

    //지급대기 버튼 클릭시 저장
    fn_onesave: function () {
      let vm = this;
      let params = new URLSearchParams();

      params.append('loginID', this.sloginID);
      params.append('salaryno', this.salary_no);
      params.append('expno', this.exp_no);
      params.append('srcdate', this.today);

      this.$vuecombiListAxios('/employee/empsave.do', params).then(function (
        response
      ) {
        console.log('empsave response' + JSON.stringify(response));
        if (response.data.result == 'SUCCESS') {
          alert('지급 되었습니다');
          vm.searchemp();
        }
        vm.btnSearch = '';
      });
    },
    //일괄 지급 저장
    allSaveBtn: function () {
      let vm = this;
      let params = new URLSearchParams();

      console.log('일괄지급 버튼 실행');
      const saveAllQue = confirm('급여를 일괄지급 하시겠습니까?');

      if (saveAllQue) {
        params.append('loginID', this.sloginID);
        params.append('salaryno', this.salary_no);
        params.append('expno', this.exp_no);
        params.append('srcdate', this.today);

        this.$vuecombiListAxios('/employee/empsaveall.do', params).then(
          function (response) {
            console.log('empsave response' + JSON.stringify(response));
            if (response.result == 'SUCCESS') {
              alert('지급 되었습니다.');
            }
          }
        );
        vm.searchemp();
        vm.btnSearch = '';
      }
    },

    //paginate callback
    clickCallback: function (pageNum) {
      console.log(pageNum);

      this.currentPage = pageNum;
      //this.Paginate.pageNum = 10;
      this.searchemp();
    },

    fn_oneemp: function (sloginID) {
      this.btnSearch = 's';
      this.sloginID = sloginID;

      console.log('this.btnSearch ' + this.btnSearch);
      console.log('this.sloginID ' + this.sloginID);
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
