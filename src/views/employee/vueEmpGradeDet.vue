<template>
  <p class="conTitle">
    <span>승진내역 상세조회</span>
  </p>
  <p class="">
    <span class="fr">
      <span>사번</span>&nbsp;<input
        type="text"
        id="emp_no"
        name="emp_no"
        style="width: 100px; height: 20px"
        v-model="dEmpNo"
        readonly
      />
      <span>사원명</span>&nbsp;<input
        type="text"
        id="name"
        name="name"
        style="width: 100px; height: 20px"
        v-model="dEmpName"
        readonly
      />
      <span>부서명</span>&nbsp;<input
        type="text"
        id="deptname"
        name="deptname"
        style="width: 100px; height: 20px"
        v-model="dDeptName"
        readonly
      />
      <span>현재직급</span>&nbsp;<input
        type="text"
        id="rankname"
        name="rankname"
        style="width: 100px; height: 20px"
        v-model="dRankName"
        readonly
      />&nbsp;&nbsp;
      <a class="btnType blue" href="" @click.prevent="btnClick()" name="modal"
        ><span>신규등록</span></a
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
        <col width="40%" />
        <col width="30%" />
        <col width="30%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">발령일자</th>
          <th scope="col">발령내용</th>
          <th scope="col">승인자</th>
        </tr>
      </thead>
      <tbody
        v-for="(list, item) in detailgrade"
        :key="item"
        id="detailEmpGrade"
      >
        <tr>
          <td>{{ list.prmtn_date }}</td>
          <td>{{ list.rankname }}</td>
          <td>{{ list.prmtn_name }}</td>
        </tr>
      </tbody>
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
      :click-handler="detailempgrade"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </Paginate>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate-next';
import vueEmpGradeDetModal from './vueEmpGradeDetModal.vue';
import { openModal } from 'jenesius-vue-modal';

export default {
  props: { empNameDet: String },
  watch: {
    empNameDet() {
      this.detId = this.empNameDet;
      this.detailempgrade();
    },
  },
  data: function () {
    return {
      ploginID: '',
      prmtn_date: '',
      prmtn_name: '',
      prankCd: '',
      action: '',
      empno: '',
      detId: '',
      rankId: '',
      detailgrade: [],
      pageSize: 5,
      pageBlockSize: 5,
      dEmpName: '',
      dEmpNo: '',
      dDeptName: '',
      dRankName: '',
      loginId: '',
      empId: '',
    };
  },
  created() {
    this.detId = this.empNameDet;
    this.detailempgrade();
    // console.log('=================================');
    // console.log(this.empNameDet);
    // console.log(this.detId);
  },
  components: {
    Paginate: Paginate,
  },
  mounted() {
    //console.log(this.$el);
    this.detId = this.empNameDet;
    this.detailempgrade();
    // console.log('mounted=================================');
    // console.log(this.empNameDet);
    // console.log(this.detId);
    // let loginInfo = vm.$store.state.loginInfo;

    // vm.ploginID = loginInfo.loginId; //로그인 아이디
    // vm.loginName = loginInfo.userNm; //로그인 이름
    // vm.userType = loginInfo.userType; //유저타입
    // vm.empno = loginInfo.empno;
    // vm.detId = loginInfo.name;
    // vm.hdeptname = loginInfo.deptname;
    // vm.hrankname = loginInfo.rankname;
  },
  methods: {
    detailempgrade: function (cpage) {
      // 승진내역 상세조회
      this.cpage = cpage || 1;
      let param = new URLSearchParams();
      let vm = this;
      param.append('pageSize', this.pageSize);
      param.append('loginId', this.detId);
      param.append('cpage', this.cpage);
      this.$vuecombiListAxios('/employee/vueDetailEmp.do', param).then(
        function (res) {
          vm.detailgrade = res.data.detailEmp;
          vm.detailcnt = res.data.countEmpdetail;
          vm.totalPage = vm.$page(vm.detailcnt, vm.pageSize);

          vm.dEmpName = res.data.detailEmp[0].name;
          vm.dEmpNo = res.data.detailEmp[0].emp_no;
          vm.dDeptName = res.data.detailEmp[0].deptname;
          vm.dRankName = res.data.detailEmp[0].rankname;
          vm.empId = res.data.detailEmp[0].loginID;

          console.log('=======================');
          console.log(res.data.detailEmp);
          // console.log(res.data.detailEmp[0].emp_no);
        }
      );
    },
    btnClick: async function () {
      const modal = await openModal(vueEmpGradeDetModal, {
        ploginID: this.empId,
        prmtn_name: this.userNm,
        dEmpNo: this.dEmpNo,
      });

      modal.onclose = () => {
        this.detailempgrade();
      };
    },
  },
};
</script>
