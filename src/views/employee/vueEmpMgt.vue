<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">인사/급여</span>
    <span class="btn_nav bold">인사 관리</span>
    <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>인사 관리</span>
  </p>

  <table
    style="
      margin-bottom: 10px;
      border: 1px #e2e6ed;
      border-style: solid !important;
    "
    height="50px"
    width="100%"
    align="left"
  >
    <tr>
      <td width="7%" height="25" style="font-size: 120%; text-align: center">
        부서
      </td>
      <td width="9%" height="25" style="font-size: 100%; text-align: left">
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
      </td>
      <td width="7%" height="25" style="font-size: 120%; text-align: center">
        직급
      </td>
      <td width="10%" height="25" style="font-size: 100%; text-align: left">
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
      </td>
      <td
        width="9%"
        height="25"
        style="font-size: 100%; text-align: left; padding-left: 14px"
      >
        <select
          id="selectKey"
          name="selectKey"
          style="width: 70px"
          v-model="selectKey"
        >
          <option value="">선택</option>
          <option value="empNo">사번</option>
          <option value="name">사원명</option>
        </select>
      </td>
      <td width="20%" height="25">
        <input
          type="text"
          style="width: 180px; height: 25px"
          id="searchWord"
          name="searchWord"
          v-model="searchWord"
        />
      </td>
      <td width="*" height="25" align="right" style="padding-right: 7px">
        <span class="fr">
          <p class="Location">
            <strong>입사일 조회&nbsp;</strong>
            <input
              type="date"
              id="srcsdate"
              name="srcsdate"
              v-model="srcsdate"
            />
            ~
            <input
              type="date"
              id="srcedate"
              name="srcedate"
              v-model="srcedate"
            />
            <a
              class="btn_icon search"
              name="search"
              id="btnSearch"
              href=""
              @click.prevent="fn_searchKey()"
              ><span id="searchEnter">조회</span></a
            >
            <!-- href="javascript:searchEmpMgt()" -->
          </p>
        </span>
      </td>
    </tr>
  </table>

  <span class="fl" style="margin-bottom : 10px; !important;">
    <a
      id="showInEmp"
      class="btnType3"
      :class="showInEmp"
      href=""
      @click.prevent="searchEmpMgt(1, 'A')"
      ><span>재직자</span></a
    >
    <a
      id="showRestEmp"
      class="btnType3"
      :class="showRestEmp"
      href=""
      @click.prevent="searchEmpMgt(1, 'B')"
      ><span>휴직자</span></a
    >
    <a
      id="showOutEmp"
      class="btnType3"
      :class="showOutEmp"
      href=""
      @click.prevent="searchEmpMgt(1, 'C')"
      ><span>퇴직자</span></a
    >
  </span>

  <!-- 재직중인 사원 목록 -->
  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="13%" />
        <col width="12%" />
        <col width="12%" />
        <col width="10%" />
        <col width="15%" />
        <col width="10%" />
        <col width="18%" />
      </colgroup>

      <thead>
        <tr>
          <th scope="col">사번</th>
          <th scope="col">사원명</th>
          <th scope="col">부서명</th>
          <th scope="col">직급</th>
          <th scope="col">입사일자</th>
          <th scope="col">재직 구분</th>
          <th scope="col" id="updateStatus" v-show="updateStatus_show">
            재직처리
          </th>
          <th scope="col" id="edDate" v-show="edDate_show">퇴직일자</th>
          <th scope="col" id="lvDay" v-show="lvDay_show">휴직기간</th>
          <th scope="col" id="comeback" v-show="comeback_show">복직처리</th>
        </tr>
      </thead>

      <template v-if="countEmpMgtList == 0">
        <tbody>
          <tr>
            <td colspan="8">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody id="listEmpMgt" v-for="(list, index) in empMgtList" :key="index">
          <tr>
            <td>
              <a href="" @click.prevent="fnEmpMgtDet(list.loginID)">{{
                list.emp_no
              }}</a>
            </td>
            <td>
              <a href="" @click.prevent="fnEmpMgtDet(list.loginID)">{{
                list.name
              }}</a>
            </td>
            <td>{{ list.dept_name }}</td>
            <td>{{ list.rank_name }}</td>
            <td>{{ list.st_date }}</td>
            <td>{{ list.status_name }}</td>
            <template v-if="list.status_cd == 'A'">
              <td>
                <a
                  class="btnType3 color1"
                  href=""
                  @click.prevent="
                    fModalLeaveEmp(
                      list.loginID,
                      list.emp_no,
                      list.name,
                      list.st_date
                    )
                  "
                  ><span>휴직처리</span></a
                >
                <a
                  class="btnType3 color1"
                  href=""
                  @click.prevent="
                    fModalRetireEmp(
                      list.loginID,
                      list.emp_no,
                      list.name,
                      list.st_date
                    )
                  "
                  ><span>퇴직처리</span></a
                >
              </td>
            </template>
            <template v-if="list.status_cd == 'B'">
              <td>{{ list.lv_date }}</td>
              <td>
                <a
                  class="btnType3 color1"
                  href=""
                  @click.prevent="
                    fModalComebackEmp(
                      list.loginID,
                      list.emp_no,
                      list.name,
                      list.lvst_date,
                      list.lved_date
                    )
                  "
                  ><span>복직처리</span></a
                >
              </td>
            </template>
            <template v-if="list.status_cd == 'C'">
              <td>{{ list.ed_date }}</td>
            </template>
          </tr>
        </tbody>
      </template>
    </table>
    <paginate
      class="justify-content-center"
      v-model="cpage"
      :page-count="totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="searchEmpMgt"
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
import ComCombo from '@/components/common/ComCombo.vue';
import Paginate from 'vuejs-paginate-next';
import vueEmpMgtDetModal from './vueEmpMgtDetModal.vue';

export default {
  data: function () {
    return {
      countEmpMgtList: '',
      empMgtList: [],
      loginID: '',

      pageSize: 5,
      pageBlockSize: 5,
      cpage: 0,
      totalPage: 1,

      dept_cd: '', //부서
      deptname: '',
      rank_cd: '', //직급
      srcrank: '',
      selectKey: '',
      searchKey: '',
      searchWord: '',
      srcsdate: '',
      srcedate: '',
      statusCd: '',
      showInEmp: {
        color1: false,
        color2: true,
      },
      showRestEmp: {
        color1: true,
        color2: false,
      },
      showOutEmp: {
        color1: true,
        color2: false,
      },
      updateStatus_show: true,
      edDate_show: false,
      lvDay_show: false,
      comeback_show: false,

      empMgtDetObj: {},
    };
  },
  components: {
    paginate: Paginate,
    ComCombo,
  },

  mounted() {
    let vm = this;
    let loginInfo = vm.$store.state.loginInfo;

    vm.loginID = loginInfo.loginId; //로그인 아이디
    vm.loginName = loginInfo.userNm; //로그인 이름
    vm.user_type = loginInfo.userType; //유저타입
    vm.searchEmpMgt();
  },
  methods: {
    fn_searchKey: function () {
      this.searchKey = '';
      if (this.selectKey == 'empNo') {
        const checkNumber = this.$checkEmpNumber(this.searchWord);
        if (!checkNumber) {
          this.searchWord = '';
          return false;
        }
      }

      if (this.selectKey == 'name') {
        const checkName = this.$checkEmpName(this.searchWord);
        if (!checkName) {
          this.searchWord = '';
          return false;
        }
      }

      // 조회 버튼 클릭 시 실행되는 메소드
      // 공통함수 checkStartEndDate를 실행하여 검색 종료일이 검색 시작일보다 빠를 시 return
      const checkDate = this.$checkStartEndDate(this.srcsdate, this.srcedate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.srcedate = '';
        return false;
      }
      this.searchKey = 'Z';
      this.searchEmpMgt();
    },
    searchEmpMgt: function (cpage, statusCd) {
      console.log('조회함수 안!!');

      this.cpage = cpage || 1;
      this.statusCd = statusCd || 'A';
      let params = new URLSearchParams();
      let vm = this;
      /* 재직자 휴직자 퇴직자 버튼 컬러 변경 */
      if (statusCd == 'A') {
        //재직
        this.showInEmp.color1 = false;
        this.showInEmp.color2 = true;
        this.showRestEmp.color1 = true;
        this.showRestEmp.color2 = false;
        this.showOutEmp.color1 = true;
        this.showOutEmp.color2 = false;
        this.updateStatus_show = true;
        this.edDate_show = false;
        this.lvDay_show = false;
        this.comeback_show = false;
      }
      if (statusCd == 'B') {
        //휴직
        this.showInEmp.color1 = true;
        this.showInEmp.color2 = false;
        this.showRestEmp.color1 = false;
        this.showRestEmp.color2 = true;
        this.showOutEmp.color1 = true;
        this.showOutEmp.color2 = false;
        this.updateStatus_show = false;
        this.edDate_show = false;
        this.lvDay_show = true;
        this.comeback_show = true;
      }
      if (statusCd == 'C') {
        //퇴직
        this.showInEmp.color1 = true;
        this.showInEmp.color2 = false;
        this.showRestEmp.color1 = true;
        this.showRestEmp.color2 = false;
        this.showOutEmp.color1 = false;
        this.showOutEmp.color2 = true;
        this.updateStatus_show = false;
        this.edDate_show = true;
        this.lvDay_show = false;
        this.comeback_show = false;
      }
      if (this.searchKey == 'Z') {
        params.append('searchDeptCd', this.deptname);
        params.append('searchRankCd', this.srcrank);
        params.append('searchKey', this.selectKey);
        params.append('searchWord', this.searchWord);
        params.append('srcsdate', this.srcsdate);
        params.append('srcedate', this.srcedate);
        params.append('pageSize', 5);
        params.append('cpage', this.cpage);
        params.append('statusCd', this.statusCd);
      } //searchKey == 'Z' if문
      else {
        params.append('pageSize', 5);
        params.append('cpage', this.cpage);
        params.append('statusCd', this.statusCd);
      }
      this.$vuecombiListAxios('/employee/vueEmpMgtList.do', params).then(
        function (res) {
          //console.log('params : ' + params);
          //console.log('여기 return : ' + JSON.stringify(res));
          vm.empMgtList = res.data.empMgtList;
          vm.countEmpMgtList = res.data.countEmpMgtList;
          vm.totalPage = vm.$page(vm.countEmpMgtList, vm.pageSize);
        }
      );
    }, //searchEmpMgt-end

    fnEmpMgtDet: function (id) {
      let params = new URLSearchParams();
      let vm = this;
      params.append('loginID', id);
      this.$vuecombiListAxios('/employee/empMgtDet.do', params).then(
        (response) => {
          //console.log('response : ' + JSON.stringify(response));
          if (response.data.result == 'SUCCESS') {
            vm.empMgtDet = response.data.empMgtDet;
            this.detailModal(vm.empMgtDet);
          }
        }
      );
    },

    detailModal: async function (loginID) {
      console.log('디테일모달 함수 안!!!');
      const modal = await openModal(vueEmpMgtDetModal, {
        empMgtDetObj: loginID,
      });

      modal.onclose = () => {
        this.searchEmpMgt(this.cpage);
      };
    },
  }, //methods-end
}; //export default-end
</script>
