<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">영업</span>
    <span class="btn_nav bold">영업계획</span>
    <a href="../business/vueEmpSalePlan.do" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>영업계획</span>
    <span class="fr">
      <a
        class="btnType blue"
        href=""
        @click.prevent="fn_newplan()"
        name="modal"
      >
        <span>계획등록</span></a
      >
    </span>
  </p>
  <div style="border: 2px solid skyblue">
    <p style="text-align: center">
      거래처
      <clientSelectBox
        client_no="client_no"
        selectid="client_no"
        type="all"
        selvalue=""
        eventid="vueEmpSalePlan"
        v-model="client_no"
        ref="Com_combo"
        style="margin-right: 3px"
        :key="keysC"
      ></clientSelectBox>
      날짜<input type="date" name="stdate" id="stdate" v-model="stdate" /> ~
      <input type="date" name="eddate" id="eddate" v-model="eddate" />
    </p>
    <p style="text-align: center">
      대분류

      <ProLComCombo
        group_code="lcategory_cd"
        selectid="lcategory_cd"
        type="all"
        selvalue=""
        eventid="ProLCombo"
        v-model="lcategory_cd"
        @change="ProLclick"
        ref="Com_combo"
        style="margin-right: 3px"
        :key="keysL"
        id="vLcategoryCd"
      ></ProLComCombo>
      중분류

      <ProMCombo
        :lcategory_cd="lcategory_cd"
        selectid="mcategory_cd"
        type="all"
        selvalue=""
        eventid="ProMCombo"
        v-model="mcategory_cd"
        @change="ProMclick"
        ref="Com_combo"
        style="margin-right: 3px"
        :key="keysM"
        v-show="categorym"
        id="vMcategoryCd"
      ></ProMCombo>
      <select name="selectl" id="selectl" v-show="selectl">
        <option value="">대분류를 선택해주세요</option>
      </select>

      제품

      <ProSCombo
        :lcategory_cd="lcategory_cd"
        :mcategory_cd="mcategory_cd"
        selectid="product_name"
        type="all"
        selvalue=""
        eventid="ProSCombo"
        v-model="product_no"
        @change="ProSclick"
        ref="Com_combo"
        style="margin-right: 3px"
        :key="keysP"
        v-show="productno"
        id="vProductNo"
      ></ProSCombo>
      <select name="selectm" id="selectm" v-show="selectm">
        <option value="">중분류를 선택해주세요</option>
      </select>

      <a
        class="btnType blue"
        href=""
        @click.prevent="fn_searchKey()"
        id="listsearch"
        name="btn"
        ><span>조회</span></a
      >
    </p>
  </div>

  <br />

  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
        <col width="16%" />
        <col width="12%" />
        <col width="12%" />
        <col width="12%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">등록일</th>
          <th scope="col">거래처이름</th>
          <th scope="col">대분류</th>
          <th scope="col">중분류</th>
          <th scope="col">제품이름</th>
          <th scope="col">목표수량</th>
          <th scope="col">실적수량</th>
          <th scope="col">비고</th>
        </tr>
      </thead>
      <template v-if="countempsaleplan == 0">
        <tbody>
          <tr>
            <td colspan="8">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody
          id="vueEmpSalePlanlist"
          v-for="(list, index) in grouplist"
          :key="index"
        >
          <tr>
            <td>{{ list.plan_date }}</td>
            <td>{{ list.client_name }}</td>
            <td>{{ list.mcname }}</td>
            <td>{{ list.pdname }}</td>
            <td>{{ list.product_name }}</td>
            <td>{{ list.goal_amt }}</td>
            <td>{{ list.now_amt }}</td>
            <td></td>
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
      :click-handler="listsearch"
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
import vueEmpSalePlanModal from './vueEmpSalePlanModal.vue';
import Paginate from 'vuejs-paginate-next';
import clientSelectBox from '@/components/common/clientSelectBox.vue';
import ProLComCombo from '@/components/common/ProLComCombo.vue';
import ProMCombo from '@/components/common/ProMCombo.vue';
import ProSCombo from '@/components/common/ProSCombo.vue';

export default {
  data: function () {
    return {
      grouplist: [],
      countempsaleplan: '',
      searchKey: '',
      group_code: 0,
      client_no: 0,
      clientName: '',

      laccount_cd: '',
      account_name: '',
      lcategory_cd: '',
      mcategory_cd: '',
      product_no: '',

      client_name: '',
      stdate: '',
      eddate: '',
      lcategory: '',
      mcategory: '',
      productname: '',
      midchoice: '',

      selectl: true,
      categorym: false,
      selectm: true,
      productno: false,
      hidden_amt: true,
      product_amt: false,

      keysL: 0,
      keysM: 0,
      keysP: 0,

      pageSize: 5,
      pageBlockSize: 5,
      cpage: 0,
      totalPage: 1,
      keysC: 0,
    };
  },
  components: {
    clientSelectBox,
    ProLComCombo,
    ProMCombo,
    ProSCombo,
    paginate: Paginate,
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
    vm.user_type = loginInfo.userType; //유저타입

    vm.listsearch();
  },
  methods: {
    ProLclick: function () {
      this.emitter.emit('ProLCombo', this.lcategory_cd);
      this.mcategory_cd = '';
      this.product_no = '';
      this.selectl = false;
      this.categorym = true;
      this.selectm = true;
      this.productno = false;
      this.keys += 1;
      this.keysP += 1;
    },
    ProMclick: function () {
      this.emitter.emit('ProMCombo', this.mcategory_cd);
      this.selectm = false;
      this.productno = true;
      this.hidden_amt = true;
      this.product_amt = false;
      this.product_no = '';
      this.keysP += 1;
    },

    ProSclick: function () {
      this.product_amt_model = '';
      this.emitter.emit('ProSCombo', this.product_no);
      if (this.product_no == '') {
        this.hidden_amt = true;
        this.product_amt = false;
      } else {
        this.hidden_amt = false;
        this.product_amt = true;
      }
    },

    fn_searchKey: function () {
      this.searchKey = '';

      // 조회 버튼 클릭 시 실행되는 메소드
      // 공통함수 checkStartEndDate를 실행하여 검색 종료일이 검색 시작일보다 빠를 시 return
      const checkDate = this.$checkStartEndDate(this.stdate, this.eddate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.eddate = '';
        return false;
      }
      this.searchKey = 'Z';
      this.listsearch();
    },

    listsearch: function (cpage) {
      this.cpage = cpage || 1;
      let params = new URLSearchParams();
      let vm = this;

      if (this.searchKey == 'Z') {
        params.append('stdate', this.stdate);
        params.append('eddate', this.eddate);
        params.append('clientname', this.client_no);
        params.append('lcategory', this.lcategory_cd);
        params.append('mcategory', this.mcategory_cd);
        params.append('productname', this.product_no);
        params.append('pageSize', 5);
        params.append('cpage', this.cpage);
      } else {
        params.append('pageSize', 5);
        params.append('cpage', this.cpage);
      }

      this.$vuecombiListAxios('/business/vueEmpSalePlanlist.do', params).then(
        function (res) {
          vm.grouplist = res.data.vueEmpSalePlanlist;
          vm.countempsaleplan = res.data.countempsaleplan;
          vm.totalPage = vm.$page(vm.countempsaleplan, vm.pageSize);
        }
      );
    },

    fn_newplan: async function () {
      //신규등록 버튼 눌렀을때

      const modal = await openModal(vueEmpSalePlanModal, {
        client: this.client,
        product: this.product,
        amount: this.amount,
      });
      modal.onclose = () => {
        this.listsearch(this.cpage);
      };
    },
  },
};
</script>
