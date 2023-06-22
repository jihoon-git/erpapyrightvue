<template>
  <div>
    <vueEstManagementDet
      v-if="estDetChk == true"
      :estDetConNo="estDetData"
    ></vueEstManagementDet>
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">영업</span>
      <span class="btn_nav bold">견적서 작성 및 조회 </span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle">
      <span>견적서 작성 및 조회</span>
      <span class="fr">
        거래처
        <input
          type="text"
          id="clientNameSearch"
          name="clientNameSearch"
          v-model="clientNameSearch"
        />
        작성일
        <input type="date" id="consdate" name="consdate" v-model="consdate" />~
        <input type="date" id="conedate" name="conedate" v-model="conedate" />
        <a
          class="btnType blue"
          href=""
          @click.prevent="searchClick()"
          id="btnClick"
          name="btn"
          ><span>조회</span></a
        >
        <a
          class="btnType blue"
          href=""
          @click.prevent="fn_openpopup()"
          name="modal"
          ><span>신규작성</span></a
        >
      </span>
    </p>

    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="10%" />
          <col width="20%" />
          <col width="20%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">작성일</th>
            <th scope="col">거래처</th>
            <th scope="col">제품이름</th>
            <th scope="col">단가</th>
            <th scope="col">수량</th>
            <th scope="col">공급가액</th>
            <th scope="col">부가세</th>
            <th scope="col">합계</th>
          </tr>
        </thead>

        <template v-if="estlistcnt == 0">
          <tbody>
            <tr>
              <td colspan="8">데이터가 존재하지 않습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody id="listEst" v-for="item in estlist" :key="item.contract_no">
            <tr>
              <td>
                <a href="" @click.prevent="fn_estdetail(item.contract_no)">
                  {{ item.contract_date }}
                </a>
              </td>
              <td>
                <a href="" @click.prevent="fn_estdetail(item.contract_no)">{{
                  item.client_name
                }}</a>
              </td>
              <td>{{ item.product_name }}</td>
              <td>{{ $comma(item.price) }} 원</td>
              <td>{{ item.product_amt }} EA</td>
              <td>{{ $comma(item.amt_price) }} 원</td>
              <td>{{ $comma(item.tax) }} 원</td>
              <td>{{ $comma(item.total_price) }} 원</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>

    <paginate
      class="justify-content-center"
      v-model="cpage"
      :page-count="totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="searchest"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate>
  </div>
</template>
<script>
import paginate from 'vuejs-paginate-next';
import vueEstManagementDet from './vueEstManagementDet.vue';
import vueEstManagementModal from './vueEstManagementModal.vue';
import { openModal } from 'jenesius-vue-modal';
export default {
  data() {
    return {
      clientNameSearch: '',
      consdate: '',
      conedate: '',
      estlist: [],
      estlistcnt: '',
      searchKey: '',

      cpage: 1,
      pageSize: 5,
      //pageBlockSize: 5,
      totalPage: 1,
      estDetData: '',
      estDetChk: false,
    };
  },
  mounted() {
    this.searchest();
    this.emitter.on('close', () => {
      this.estDetChk = false;
    });
  },
  components: {
    paginate: paginate,
    vueEstManagementDet,
  },
  methods: {
    searchClick: function () {
      this.searchKey = '';

      // 조회 버튼 클릭 시 실행되는 메소드
      // 공통함수 checkStartEndDate를 실행하여 검색 종료일이 검색 시작일보다 빠를 시 return
      const checkDate = this.$checkStartEndDate(this.consdate, this.conedate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.conedate = '';
        return false;
      }
      this.searchKey = 'Z';
      this.searchest();
    },
    searchest: function (cpage) {
      //this.conDetChk = false;
      //this.estDetChk = false;
      let vm = this;
      this.cpage = cpage || 1; // 현재 page가 undefined 면 1로 셋팅

      // param과 callback 지정
      let params = new URLSearchParams();
      params.append('pageSize', this.pageSize);
      params.append('cpage', this.cpage);

      // 검색버튼을 눌러서 리스트를 출력하는 경우
      // 파라미터 값으로 검색 조건들을 함께 담아서 보냄
      if (this.searchKey == 'Z') {
        params.append('clientNameSearch', this.clientNameSearch);
        params.append('consdate', this.consdate);
        params.append('conedate', this.conedate);
      }

      this.$vuecombiListAxios('/business/vueEstmanagementlist.do', params)
        .then(function (response) {
          vm.estlist = response.data.estmanagementlist;
          vm.estlistcnt = response.data.cntestmanagementlist;

          vm.totalPage = vm.$page(vm.estlistcnt, vm.pageSize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_estdetail: function (contract_no) {
      this.estDetChk = true;
      //this.conDetChk = false;
      this.estDetData = contract_no;
      console.log(contract_no);
      //   console.log(this.estDetData);
      //   console.log('======================부모창');
    },
    fn_openpopup: async function () {
      const modal = await openModal(vueEstManagementModal);

      modal.onclose = () => {
        this.searchest();
        this.estDetChk = false;
      };
    },
  },
};
</script>
