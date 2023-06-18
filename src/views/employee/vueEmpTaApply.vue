<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">인사관리</span>
    <span class="btn_nav bold">근태신청/조회</span>
    <a href="../employee/empTaApply.do" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>근태신청/조회</span>
    <span class="fr">
      일자<input type="date" id="srcsdate" name="srcsdate" v-model="srcsdate" />
      ~
      <input type="date" id="srcedate" name="srcedate" v-model="srcedate" />
      <select
        id="rest_cd_search"
        name="rest_cd_search"
        v-model="rest_cd_search"
      >
        <option value="">근태종류</option>
        <option value="월차">월차</option>
        <option value="연차">연차</option>
      </select>
      <select id="search_atd_yn" name="search_atd_yn" v-model="search_atd_yn">
        <option value="">결재상태</option>
        <option value="y">승인</option>
        <option value="w">승인대기</option>
        <option value="n">반려</option>
      </select>
      <a
        class="btnType blue"
        href=""
        @click.prevent="searchBtnClick()"
        name="modal"
      >
        <span>조회</span></a
      >
    </span>
  </p>

  <div>
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="30%" />
        <col width="30%" />
        <col width="30%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">총 연차</th>
          <th scope="col">사용 연차</th>
          <th scope="col">남은 연차</th>
        </tr>
      </thead>

      <tbody id="total_rest" v-for="(list, index) in grouplist2" :key="index">
        <tr>
          <td>{{ list.total_rest }}</td>
          <td>{{ list.use_rest }}</td>
          <td>{{ list.remain_rest }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <a
    class="btnType blue"
    href=""
    @click.prevent="insertBtnClick()"
    name="modal"
    style="float: right"
  >
    <span>개인근태신청</span></a
  >
  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="10%" />
        <col width="10%" />
        <col width="25%" />
        <col width="25%" />
        <col width="15%" />
        <col width="15%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">휴가종류</th>
          <th scope="col">시작일</th>
          <th scope="col">종료일</th>
          <th scope="col">결재자</th>
          <th scope="col">결재상태</th>
        </tr>
      </thead>
      <template v-if="counttaApplylist == 0">
        <tbody>
          <tr>
            <td colspan="8">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody id="taApplylist" v-for="list in grouplist" :key="list.atd_no">
          <tr>
            <td>{{ list.atd_no }}</td>
            <td>{{ list.rest_name }}</td>
            <td>{{ list.st_date }}</td>
            <td>{{ list.ed_date }}</td>
            <td>{{ list.atd_name }}</td>
            <td>
              <template v-if="list.atd_yn == '반려'">
                <!-- <a href="javascript:fn_rest_reject('${list.atd_no}')" >${list.atd_yn}</a> -->
                <a href="" @click.prevent="fn_rest_reject(list.atd_no)">{{
                  list.atd_yn
                }}</a>
              </template>
              <template v-else>
                {{ list.atd_yn }}
              </template>
            </td>
          </tr>
        </tbody>
      </template>

      <input
        type="hidden"
        id="counttaApplylist"
        name="counttaApplylist"
        :value="counttaApplylist"
      />
    </table>

    <paginate
      class="justify-content-center"
      v-model="cpage"
      :page-count="totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="searchTaApply"
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
import vueEmpTaApplyModal from './vueEmpTaApplyModal.vue';
import vueEmpTaApplyRejModal from './vueEmpTaApplyRejModal.vue';
import Paginate from 'vuejs-paginate-next';

export default {
  data: function () {
    return {
      grouplist: [],
      grouplist2: [],
      counttaApplylist: '',

      total_rest: '',
      use_rest: '',
      remain_rest: '',

      atd_no: '',
      rest_name: '',
      st_date: '',
      ed_date: '',
      atd_name: '',
      atd_yn: '',

      srcsdate: '',
      srcedate: '',
      search_atd_yn: '',
      rest_cd_search: '',

      pageSize: 5,
      pageBlockSize: 5,
      cpage: 0,
      totalPage: 1,
      modalChk: false,
      modalData: this.loginId,
      rest_info: {},
    };
  },
  components: {
    paginate: Paginate,
  },
  mounted() {
    let vm = this;
    let loginInfo = vm.$store.state.loginInfo;

    vm.loginID = loginInfo.loginId; //로그인 아이디
    vm.loginName = loginInfo.userNm; //로그인 이름
    vm.user_type = loginInfo.userType; //유저타입

    vm.searchTaApply();
  },
  methods: {
    searchBtnClick: function () {
      this.searchKey = '';

      // 조회 버튼 클릭 시 실행되는 메소드
      // 공통함수 checkStartEndDate를 실행하여 검색 종료일이 검색 시작일보다 빠를 시 return
      const checkDate = this.$checkStartEndDate(this.srcsdate, this.srcedate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.srcedate = '';
        return false;
      }
      this.searchKey = 'Z';
      this.searchTaApply();
    },

    searchTaApply: function (cpage) {
      this.cpage = cpage || 1;
      let param = new URLSearchParams();
      let vm = this;
      if (this.searchKey == 'Z') {
        param.append('srcsdate', this.srcsdate);
        param.append('srcedate', this.srcedate);
        param.append('search_rest_name', this.rest_cd_search);
        param.append('search_atd_yn', this.search_atd_yn);
        param.append('pageSize', 5);
        param.append('cpage', this.cpage);
        param.append('loginId', this.loginID);
      } else {
        param.append('pageSize', 5);
        param.append('cpage', this.cpage);
        param.append('loginId', this.loginID);
      }
      this.$vuecombiListAxios('/employee/empTaApplylistvue.do', param).then(
        function (res) {
          console.log('return : ' + JSON.stringify(res));
          vm.grouplist2 = res.data.total_rest;
          vm.grouplist = res.data.taApplylist;
          vm.counttaApplylist = res.data.counttaApplylist;
          //vm.totalPage = vm.page();
          vm.totalPage = vm.$page(vm.counttaApplylist, vm.pageSize);
        }
      );
    },
    insertBtnClick: function () {
      let param = new URLSearchParams();
      param.append('loginId', this.loginID);
      this.$vuecombiListAxios('/employee/restinfo.do', param).then(
        (response) => {
          // console.log('아직 안담았음============================');
          // console.log('response : ' + JSON.stringify(response));
          // console.log('response : ' + JSON.stringify(response.data));
          // console.log('response : ' + JSON.stringify(response.data.rest_info));

          this.rest_info = response.data.rest_info;
          // console.log('담았음============================');
          // console.log(this.rest_info);
          // console.log('zzzzzz : ' + this.rest_info.emp_no);
          this.detailModal();
        }
      );
    },
    detailModal: async function () {
      // console.log('모달밖this.rest_info  : ' + this.rest_info);
      // console.log('Mdept_name : ' + this.rest_info.dept_name);
      // console.log('this.Memp_num : ' + this.rest_info.emp_no);
      console.log('hp : ' + this.rest_info.hp);
      const modal = await openModal(vueEmpTaApplyModal, {
        dept_name: this.rest_info.dept_name,
        loginName: this.loginName,
        emp_num: this.rest_info.emp_no,
        hp: this.rest_info.hp,
      });

      modal.onclose = () => {
        this.searchTaApply();
      };
    },
    fn_rest_reject: async function (atd_no) {
      console.log('반려버튼 눌렀다');
      console.log('여기 atd_no : ' + atd_no);
      //반려버튼 눌렀을 때 모달창 띄우기
      const modal = await openModal(vueEmpTaApplyRejModal, {
        Matd_no: atd_no,
      });

      modal.onclose = () => {
        this.searchTaApply();
      };
    },
  },
};
</script>

<style></style>
