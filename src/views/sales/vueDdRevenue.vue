<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">매출</span>
      <span class="btn_nav bold">일별매출현황</span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <!-- 일별매출현황 제목 -->
    <p class="conTitle"><span>일별매출현황</span> <span class="fr"></span></p>

    <!-- 검색창 -->
    <span>거래처명&nbsp;</span>
    <clientSelectBox
      client_no="client_no"
      selectid="client_no"
      type="all"
      selvalue=""
      eventid="vueOeManagement"
      v-model="client_no"
      ref="Com_combo"
      style="margin-right: 3px"
    ></clientSelectBox>

    <!-- 날짜(일 단위) 선택 -->
    <span class="fr" style="padding-right: 20px">
      <p class="Location">
        <input
          type="date"
          id="searchDate_today"
          name="searchDate"
          style="width: 250px"
          v-model="searchDate"
        />
        <a class="btnType blue" href="" @click.prevent="btnSearch()">
          <span>검 색</span></a
        >
      </p>
    </span>
    <!-- 검색창 끝 -->

    <!-- 차트 영역 -->
    <div class="divddRevenueSumList">
      <table class="col" width="900" height="300">
        <tr>
          <!-- 일별매출/한달간 누적매출 차트 영역 -->
          <td width="60%">
            <div>
              <vueDdRevenueDet
                :date="searchDate"
                :MonthAgo="oneMonthAgo"
                :clientno="client_no"
                :key="key"
              ></vueDdRevenueDet>
            </div>
          </td>
          <!-- 일자별 품목별 매출 파이 차트 영역 -->
          <td width="35%">
            <div>
              <template v-if="totalCnt != 0">
                <vueDdRevenueProduct
                  :date="searchDate"
                  :clientno="client_no"
                  :key="key"
                >
                </vueDdRevenueProduct>
              </template>
              <template v-else>
                <div style="position: relative; left: 90px">
                  <span><strong> 데이터가 존재하지 않습니다. </strong> </span>
                </div>
              </template>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- 일별매출조회 테이블 -->
    <div class="divddRevenueList">
      <span>총&nbsp;</span
      ><span style="color: red; font-weight: bold">{{ totalCnt }} </span
      ><span>건</span>
      <table class="col">
        <caption>
          단위:원
        </caption>
        <colgroup>
          <col width="12.5%" />
          <col width="12.5%" />
          <col width="12.5%" />
          <col width="12.5%" />
          <col width="12.5%" />
          <col width="12.5%" />
          <col width="12.5%" />
          <col width="12.5%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">수주일자</th>
            <th scope="col">기업명</th>
            <th scope="col">상품명</th>
            <th scope="col">수량</th>
            <th scope="col">단가</th>
            <th scope="col">공급가액</th>
            <th scope="col">부가세</th>
            <th scope="col">합계</th>
          </tr>
        </thead>

        <template v-if="totalCnt == 0">
          <tbody>
            <tr>
              <td colspan="8">
                <strong> 데이터가 존재하지 않습니다. </strong>
              </td>
            </tr>
          </tbody>
        </template>

        <template v-else>
          <tbody v-for="(list, index) in ddRevenueList" :key="index">
            <tr>
              <td>{{ list.contract_date }}</td>
              <td>{{ list.client_name }}</td>
              <td>{{ list.product_name }}</td>
              <td>{{ list.product_amt }}EA</td>
              <td>{{ $comma(list.price) }}원</td>
              <td>{{ $comma(list.amt_price) }}원</td>
              <td>{{ $comma(list.tax) }}원</td>
              <td>{{ $comma(list.total_price) }}원</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div>
      <paginate
        class="justify-content-center"
        v-model="currentPage"
        :page-count="totalPage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="searchDdRev"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
      <tr style="border: 0px; border-color: blue">
        <td width="80" height="25" style="font-size: 120%">&nbsp;&nbsp;</td>
        <td
          width="50"
          height="25"
          style="font-size: 100%; text-align: left; padding-right: 25px"
        ></td>
      </tr>
    </div>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate-next';
import clientSelectBox from '@/components/common/clientSelectBox.vue';
//import { openModal } from 'jenesius-vue-modal';
import vueDdRevenueDet from './vueDdRevenueDet.vue';
import vueDdRevenueProduct from './vueDdRevenueProduct.vue';
//import { vuecombiListAxios } from '../system';

export default {
  created() {
    this.searchDate = this.$getToday();
    this.getMontago();
    console.log('this.searchDate ' + this.searchDate);
    console.log('this.oneMonthAgo ' + this.oneMonthAgo);
  },
  mounted() {
    this.fn_searchDdRev();
    //this.searchDdRev();
  },
  data: function () {
    return {
      //초기화면 리스트
      ddRevenueList: [],

      //pageinate 설정
      currentPage: 0,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0,
      grdNo: 1,

      //검색
      src: '',
      client_no: '',
      searchDate: '',
      oneMonthAgo: '',

      totalCntdRevList: 0,
      clientName: '',
      laccount_cd: '',
      laccountName: '',
      testVal: 0,
      account_cd: '',

      key: 0,
    };
  },
  computed: {},
  components: {
    paginate: Paginate,
    clientSelectBox,
    vueDdRevenueDet,
    vueDdRevenueProduct,
  },
  methods: {
    //오늘 날짜 입력
    fn_searchDdRev: function () {
      this.searchDate = this.$getToday();
      this.getMontago();
      this.searchDdRev();
    },
    getFormatDate: function (date) {
      let year = date.getFullYear();
      let month = 1 + date.getMonth();
      month = month >= 10 ? month : '0' + month;
      let day = date.getDate();
      day = day >= 10 ? day : '0' + day;
      return year + '-' + month + '-' + day;
    },
    getMontago: function () {
      let strArr = this.searchDate.split('-');
      let oneMonthAgo_ = new Date(strArr[0], strArr[1] - 1, strArr[2]);
      oneMonthAgo_ = new Date(
        oneMonthAgo_.setMonth(oneMonthAgo_.getMonth() - 1)
      ); // 한달 전
      this.oneMonthAgo = this.getFormatDate(oneMonthAgo_);
    },

    btnSearch: function () {
      this.src = 'S';
      this.key += 1;
      this.searchDdRev();
    },
    //화면초기
    searchDdRev: function (currentPage) {
      let vm = this;
      let params = new URLSearchParams();

      this.currentPage = currentPage || 1;

      if (this.src == 'S') {
        params.append('currentPage', this.currentPage);
        params.append('pageSize', this.pageSize);
        params.append('searchClientNo', this.client_no);
        params.append('searchDate', this.searchDate);

        console.log('this.client_no ' + this.client_no);
        console.log('this.searchDate ' + this.searchDate);
        console.log('this.oneMonthAgo ' + this.oneMonthAgo);
      } else {
        params.append('currentPage', this.currentPage);
        params.append('pageSize', this.pageSize);
      }

      this.$vuecombiListAxios('/sales/vueDdRevenueList.do', params).then(
        function (response) {
          //console.log('searchAcctitle response' + JSON.stringify(response));

          //paginate 설정
          vm.totalCnt = response.data.totalCntddRevenue;
          vm.ddRevenueList = response.data.ddRevenueList;
          //page를 전역변수 사용
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
          //vm.totalPage = vm.page();

          vm.currentPage == 1
            ? (vm.grdNo = 1)
            : (vm.grdNo = 5 * (vm.currentPage - 1) + 1);

          for (let value of vm.ddRevenueList) {
            value.indexNew = vm.grdNo++;
          }
        }
      );

      //console.log('this.laccount_cd ' + this.laccount_cd);
      //console.log('this.account_cd ' + this.account_cd);
    },

    //paginate callback
    clickCallback: function (pageNum) {
      console.log(pageNum);

      this.currentPage = pageNum;
      //this.Paginate.pageNum = 10;
      this.searchDdRev();
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
