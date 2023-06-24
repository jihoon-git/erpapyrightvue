<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">영업</span>
    <span class="btn_nav bold">수주서 작성 및 조회</span>
    <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>수주서 작성 및 조회</span>
    <span class="fr" style="margin-top: 5px">
      <input
        type="date"
        id="srcsdate"
        name="srcsdate"
        style="width: 145px"
        v-model="srcsdate"
      />~
      <input
        type="date"
        id="srcedate"
        name="srcedate"
        style="width: 145px"
        v-model="srcedate"
      />

      거래처명
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
      <a
        class="btnType blue"
        href=""
        @click.prevent="fn_searchKey()"
        name="modal"
        ><span>조회</span></a
      >
    </span>
  </p>
  <a
    class="btnType blue"
    href=""
    @click.prevent="fn_insertContract()"
    name="modal"
    style="margin-left: 905px"
    ><span>수주서 신규등록</span></a
  >

  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="8%" />
        <col width="7%" />
        <col width="20%" />
        <col width="20%" />
        <col width="5%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
      </colgroup>

      <thead>
        <tr>
          <th scope="col">견적서번호</th>
          <th scope="col">수주번호</th>
          <th scope="col">거래처</th>
          <th scope="col">제품이름</th>
          <th scope="col">수량</th>
          <th scope="col">부가세</th>
          <th scope="col">단가</th>
          <th scope="col">공급가액</th>
          <th scope="col">총액</th>
        </tr>
      </thead>
      <template v-if="totalCnt == 0">
        <tbody>
          <tr>
            <td colspan="9">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody v-for="(list, index) in oEManagementList" :key="index">
          <tr>
            <td style="font-weight: bold">{{ list.estimate_cd }}</td>
            <td style="font-weight: bold">
              <a
                href=""
                @click.prevent="
                  fn_contractDetaile(list.order_cd, list.product_no)
                "
                >{{ list.order_cd }}</a
              >
            </td>
            <td style="font-weight: bold">{{ list.client_name }}</td>
            <td style="font-weight: bold">{{ list.product_name }}</td>
            <td style="font-weight: bold">{{ list.product_amt }} EA</td>
            <td style="font-weight: bold">{{ $comma(list.tax) }} 원</td>
            <td style="font-weight: bold">{{ $comma(list.price) }} 원</td>
            <td style="font-weight: bold">{{ $comma(list.amt_price) }} 원</td>
            <td style="color: blue; font-weight: bold">
              {{ $comma(list.total_price) }}원
            </td>
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
      :click-handler="oEManagemenSearch"
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
import clientSelectBox from '@/components/common/clientSelectBox.vue';
import Paginate from 'vuejs-paginate-next';
import vueOeManagementModal from './vueOeManagementModal.vue';
import vueOeManagementDetModalVue from './vueOeManagementDetModal.vue';

export default {
  data: function () {
    return {
      oEManagementList: [],
      totalCnt: '',
      searchKey: '',

      srcsdate: '',
      srcedate: '',
      client_no: '', //거래처 콤보박스
      clientName: '',

      pageSize: 5,
      pageBlockSize: 5,
      cpage: 0,
      totalPage: 1,

      estimate_cd: '',
    };
  },
  components: {
    clientSelectBox,
    paginate: Paginate,
  },
  mounted() {
    let vm = this;
    vm.oEManagemenSearch();
  },
  methods: {
    fn_searchKey: function () {
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
      this.oEManagemenSearch();
    },

    oEManagemenSearch: function (cpage) {
      this.cpage = cpage || 1;
      let params = new URLSearchParams();
      let vm = this;

      if (this.searchKey == 'Z') {
        params.append('srcsdate', this.srcsdate);
        params.append('srcedate', this.srcedate);
        params.append('client_no', this.client_no);
        params.append('pageSize', 5);
        params.append('cpage', this.cpage);
      } else {
        params.append('pageSize', 5);
        params.append('cpage', this.cpage);
      }
      this.$vuecombiListAxios('/business/vueOeManagementList.do', params).then(
        function (res) {
          console.log('return : ' + JSON.stringify(res));
          vm.oEManagementList = res.data.oEManagementList;
          vm.totalCnt = res.data.totalCnt;
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
        }
      );
    },

    fn_insertContract: function () {
      //신규등록 버튼 눌렀을때
      let params = new URLSearchParams();
      let vm = this;
      this.$vuecombiListAxios('/business/contractDetaile.do', params).then(
        (response) => {
          console.log('여기확인: ' + JSON.stringify(response));
          vm.estimate_cd = response.data.contractDetaile[0].estimate_cd;
          console.log('vm.estimate_cd :' + vm.estimate_cd);
          this.insertModal();
        }
      );
    },
    insertModal: async function () {
      //신규등록 모달창을 띄움
      const modal = await openModal(vueOeManagementModal, {
        estimate_cd: this.estimate_cd,
        client_name: this.client_name,
        lproduct_name: this.lproduct_name,
        mproduct_name: this.mproduct_name,
        product_name: this.product_name,
        product_amt: this.product_amt,
        stock: this.stock,
      });
      modal.onclose = () => {
        this.oEManagemenSearch();
      };
    },

    fn_contractDetaile: async function (order_cd, product_no) {
      console.log('여기 order_cd : ' + order_cd);
      console.log(' 여기 product_no' + product_no);
      const modal = await openModal(vueOeManagementDetModalVue, {
        Morder_cd: order_cd,
        Mproduct_no: product_no,
      });
      console.log('order_cd:' + order_cd);
      console.log('product_no:' + product_no);

      modal.onclose = () => {
        this.oEManagemenSearch(this.cpage);
      };
    },
  },
};
</script>
