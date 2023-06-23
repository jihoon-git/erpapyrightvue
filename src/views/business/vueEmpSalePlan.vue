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
        :key="keys"
      ></clientSelectBox>
      날짜<input type="date" name="stdate" id="stdate" v-model="stdate" /> ~
      <input type="date" name="eddate" id="eddate" v-model="eddate" />
    </p>
    <p style="text-align: center">
      대분류
      <select
        name="lcategory"
        id="lcategory"
        v-model="lcategory"
        @change="lcategorychange()"
      ></select>
      중분류
      <select id="midchoice" v-model="midchoice" v-show="midchoiceflag">
        <option value="">선택</option>
      </select>
      <select
        name="mcategory"
        id="mcategory"
        v-model="mcategory"
        v-show="mcategoryflag"
        @change="mcategorychange()"
      ></select>
      제품
      <select id="prodchoice" v-model="prodchoice" v-show="prodchoiceflag">
        <option value="">선택</option>
      </select>
      <select
        name="productname"
        id="productname"
        v-model="productname"
        v-show="productnameflag"
      ></select>
      <a
        class="btnType blue"
        href=""
        @click.prevent="fn_searchKey()"
        id="listsearch"
        name="btn"
        ><span>조회</span></a
      >
      <a
        class="btnType blue"
        href="()"
        @click.prevent="resetsearch()"
        name="modal"
        ><span>검색초기화</span></a
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
export default {
  data: function () {
    return {
      grouplist: [],
      countempsaleplan: '',
      client_no: '', //거래처 콤보박스
      searchKey: '',

      client_name: '',
      stdate: '',
      eddate: '',
      lcategory: '',
      mcategory: '',
      productname: '',
      midchoice: '',
      midchoiceflag: '',
      mcategoryflag: '',
      prodchoice: '',
      prodchoiceflag: '',
      productnameflag: '',

      pageSize: 5,
      pageBlockSize: 5,
      cpage: 0,
      totalPage: 1,
      keys: 0,
    };
  },
  components: {
    clientSelectBox,
    paginate: Paginate,
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
    resetsearch: function () {
      console.log(this.client_no);
      console.log('검색 초기화 함수 안!!');
      this.client_no = ''; //콤콤보 초기화
      this.stdate = '';
      this.eddate = '';
      this.lcategory = '';
      this.mcategory = '';
      this.productname = '';
      this.keys += 1; //고유값이 달라져서 component를 재실행함
    },
    fn_newplan: async function () {
      //신규등록 버튼 눌렀을때
      console.log('신규등록 버튼 눌렀다!!');
      const modal = await openModal(vueEmpSalePlanModal, {
        client: this.client,
        product: this.product,
        amount: this.amount,
      });
      modal.onclose = () => {
        this.fn_searchKey();
      };
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
      console.log('검색함수 안!!!');
      this.cpage = cpage || 1;
      let params = new URLSearchParams();
      let vm = this;

      params.append('pageSize', 5);
      params.append('cpage', this.cpage);

      if (this.searchKey == 'Z') {
        params.append('stdate', this.stdate);
        params.append('eddate', this.eddate);
        params.append('clientname', this.client_no);
        params.append('lcategory', this.lcategory);
        params.append('mcategory', this.mcategory);
        params.append('productname', this.productname);
      }

      this.$vuecombiListAxios('/business/vueEmpSalePlanlist.do', params).then(
        function (res) {
          console.log('===============' + params);
          console.log('조회함수 안 RES :' + JSON.stringify(res));
          vm.grouplist = res.data.vueEmpSalePlanlist;
          vm.countempsaleplan = res.data.countempsaleplan;
          vm.totalPage = vm.$page(vm.countempsaleplan, vm.pageSize);
        }
      );
    },
  },
};
</script>
