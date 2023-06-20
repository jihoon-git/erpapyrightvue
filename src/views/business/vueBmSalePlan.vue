<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">영업</span>
    <span class="btn_nav bold">영업 실적 조회</span>
    <a href="../business/vueBmSalePlan.do" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>영업 실적 조회</span>
    <span class="fr">
      <template v-if="userType == 'B' || userType == 'A'">
        사원명
        <input
          type="text"
          name="empname"
          id="empname"
          v-model="empname"
          style="width: 80px"
        />
      </template>
      조회날짜
      <input
        type="date"
        name="scsearchdate"
        id="scsearchdate"
        v-model="scsearchdate"
      />
      제품 대분류 품목별
      <select
        name="lcategory"
        id="lcategory"
        v-model="lcategory"
        v-show="lcategoryflag"
        style="width: 70px"
        @change="lcategorychange()"
      ></select>
      제품 중분류 품목별
      <select id="midchoice" style="width: 70px" v-show="midchoiceflag">
        <option>선택</option>
      </select>
      <select
        name="mcategory"
        id="mcategory"
        v-model="mcategory"
        v-show="mcategoryflag"
        style="width: 70px"
        @change="mcategorychange()"
      ></select>
      제품이름
      <select id="prodchoice" style="width: 70px" v-show="prodchoiceflag">
        <option>선택</option>
      </select>
      <select
        name="productname"
        id="productname"
        v-model="productname"
        v-show="productnameflag"
        style="width: 70px"
      ></select>
      <a
        class="btnType blue"
        href=""
        id="listsearch"
        name="btn"
        @click.prevent="searchPlan()"
        ><span>조회</span></a
      >
    </span>
  </p>

  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <template v-if="userType == 'B' || userType == 'A'">
        <colgroup>
          <col width="8%" />
          <col width="9%" />
          <col width="9%" />
          <col width="9%" />
          <col width="13%" />
          <col width="18%" />
          <col width="9%" />
          <col width="9%" />
          <col width="9%" />
          <col width="7%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">사번</th>
            <th scope="col">이름</th>
            <th scope="col">거래처</th>
            <th scope="col">날짜</th>
            <th scope="col">제품코드</th>
            <th scope="col">제품이름</th>
            <th scope="col">목표수랑</th>
            <th scope="col">실적수량</th>
            <th scope="col">달성율</th>
            <th scope="col">비고</th>
          </tr>
        </thead>
      </template>
      <template v-if="userType == 'D'">
        <colgroup>
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="16%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">날짜</th>
            <th scope="col">거래처</th>
            <th scope="col">제품코드</th>
            <th scope="col">제품이름</th>
            <th scope="col">목표수랑</th>
            <th scope="col">실적수량</th>
            <th scope="col">달성율</th>
            <th scope="col">비고</th>
          </tr>
        </thead>
      </template>

      <template v-if="userType == 'B' || userType == 'A'">
        <template v-if="countbmsaleplan == 0">
          <tbody>
            <tr>
              <td colspan="10">데이터가 존재하지 않습니다.</td>
            </tr>
          </tbody>
        </template>

        <template v-else>
          <tbody
            v-for="(list, index) in grouplist"
            :key="index"
            :id="bmsaleplanlist"
          >
            <tr>
              <td>{{ list.emp_no }}</td>
              <td>{{ list.name }}</td>
              <td>{{ list.client_name }}</td>
              <td>{{ list.plan_date }}</td>
              <td>{{ list.product_no }}</td>
              <td>{{ list.product_name }}</td>
              <td>{{ list.goal_amt }}</td>
              <td>{{ list.now_amt }}</td>
              <td>{{ list.acvm_rate }}</td>
              <td></td>
            </tr>
          </tbody>
        </template>
      </template>

      <template v-if="userType == 'D'">
        <template v-if="countbmsaleplan == 0">
          <tbody>
            <tr>
              <td colspan="8">데이터가 존재하지 않습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody
            v-for="(list, index) in grouplist"
            :key="index"
            :id="bmsaleplanlist"
          >
            <tr>
              <td>{{ list.plan_date }}</td>
              <td>{{ list.client_name }}</td>
              <td>{{ list.product_no }}</td>
              <td>{{ list.product_name }}</td>
              <td>{{ list.goal_amt }}</td>
              <td>{{ list.now_amt }}</td>
              <td>{{ list.acvm_rate }}</td>
              <td></td>
            </tr>
          </tbody>
        </template>
      </template>
    </table>
  </div>
  <!-- 페이징 처리  -->
  <div id="resPagination">
    <Paginate
      class="justify-content-center"
      v-model="cPage"
      :page-count="totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="allBmSalePlanList"
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

export default {
  data: function () {
    return {
      pageSize: 5,
      pageBlockSize: 5,
      empname: '',
      searchdate: '',
      lcategory: '',
      mcategory: '',
      productname: '',
      grouplist: [],
      countbmsaleplan: 0,
      bmSalePlanPagination: '',
      userType: '',
      lcategoryflag: true,
      midchoiceflag: true,
      mcategoryflag: false,
      prodchoiceflag: true,
      productnameflag: false,
      scempname: '',
      scsearchdate: '',
      sclcategory: '',
      scmcategory: '',
      scproductname: '',
      userNm: '',
      loginId: '',
      totalPage: 1,
      cpage: 1,
    };
  },
  components: {
    Paginate: Paginate,
  },
  mounted() {
    let vm = this;
    let loginInfo = vm.$store.state.loginInfo;

    vm.loginID = loginInfo.loginId; //로그인 아이디
    vm.loginName = loginInfo.userNm; //로그인 이름
    vm.userType = loginInfo.userType; //유저타입
    console.log(' vm.user_type : ' + vm.userType);
    vm.allBmSalePlanList();
  },
  methods: {
    searchPlan: function () {
      const empnamecheck = this.$checkEmpName(this.empname);
      if (!empnamecheck) {
        this.empname = '';
        return false;
      }

      this.allBmSalePlanList();
    },
    allBmSalePlanList: function (cpage) {
      this.cpage = cpage || 1;
      let param = new URLSearchParams();
      let vm = this;
      param.append('empname', this.empname);
      param.append('searchdate', this.scsearchdate); // (db에 저장된 이름, )
      param.append('lcategory', '');
      param.append('mcategory', '');
      param.append('productname', '');
      param.append('pageSize', this.pageSize);
      param.append('cpage', this.cpage);
      this.$vuecombiListAxios('/business/vueBmsaleplanlist.do', param).then(
        function (res) {
          console.log('=============' + param);
          console.log('res : ' + JSON.stringify(res));
          vm.grouplist = res.data.bmsaleplanlist;
          vm.countbmsaleplan = res.data.countbmsaleplan;
          vm.totalPage = vm.$page(vm.countbmsaleplan, vm.pageSize);
        }
      );
    },
  },
};
</script>
