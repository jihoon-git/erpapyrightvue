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
      <ProLComCombo
        group_code="lcategory_cd"
        selectid="lcategory_cd"
        type="all"
        selvalue=""
        eventid="ProLCombo"
        v-model="lcategory_cd"
        @change="ProLclick"
        ref="Com_combo"
        style="width: 70px"
      ></ProLComCombo>
      제품 중분류 품목별
      <ProMCombo
        :lcategory_cd="lcategory_cd"
        selectid="mcategory_cd"
        type="all"
        selvalue=""
        eventid="ProMCombo"
        v-model="mcategory_cd"
        @change="ProMclick"
        ref="Com_combo"
        style="width: 70px"
      ></ProMCombo>
      제품이름
      <ProSCombo
        :lcategory_cd="lcategory_cd"
        :mcategory_cd="mcategory_cd"
        selectid="product_name"
        type="all"
        selvalue=""
        eventid="ProSCombo"
        v-model="product_no"
        @change="ProSclick"
        :key="key"
        ref="Com_combo"
        style="width: 70px"
      ></ProSCombo>
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
import ProLComCombo from '@/components/common/ProLComCombo.vue';
import ProMCombo from '@/components/common/ProMCombo.vue';
import ProSCombo from '@/components/common/ProSCombo.vue';
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
      lcategory_cd: '',
      mcategory_cd: '',
      product_no: '',
      grouplist: [],
      countbmsaleplan: 0,
      bmSalePlanPagination: '',
      userType: '',
      scempname: '',
      scsearchdate: '',
      sclcategory: '',
      scmcategory: '',
      scproductname: '',
      userNm: '',
      loginId: '',
      totalPage: 1,
      cpage: 1,
      key: '',
    };
  },
  components: {
    ProLComCombo,
    ProMCombo,
    ProSCombo,
    Paginate: Paginate,
  },
  unmounted() {
    this.emitter.off('ProLCombo');
    this.emitter.off('ProMCombo');
    this.emitter.off('ProSCombo');
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
      param.append('searchdate', this.scsearchdate);
      param.append('lcategory', this.lcategory_cd);
      param.append('mcategory', this.mcategory_cd);
      param.append('productname', this.product_no);
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
    ProLclick: function () {
      //this.emitter.emit('ProLCombo', this.lcategory_cd);
      this.key += 1;
      if (this.lcategory_cd == '') {
        this.product_no = '';
      }
    },
    ProMclick: function () {
      this.emitter.emit('ProMCombo', this.mcategory_cd);
    },

    ProSclick: function () {
      this.emitter.emit('ProSCombo', this.product_no);
    },
  },
};
</script>
