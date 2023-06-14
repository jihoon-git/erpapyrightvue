<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">거래내역</span>
    <span class="btn_nav bold">일별수주내역</span>
    <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
  </p>

  <div id="searchWrap" class="d-flex flex-column">
    <div>
      <h1 id="banner" class="flex-grow-1">일별수주내역</h1>
    </div>

    <div class="d-flex mb-4">
      <!-- <div>
                <input type="radio" v-model="param.typeByRef" value="returnOnly" @click="returns($event)">반품요청
                <input type="radio" v-model="param.typeByRef" value="purchaseOnly" @click="returns($event)">미반품요청    
            </div> -->

      <div style="display: inline-block" class="flex-grow-1 text-center">
        <select class="mr-2" v-model="param.typeOfDate">
          <option value="">전체</option>
          <option value="0">주문일자로 조회</option>
          <option value="1">반품처리일자로 조회</option>
        </select>
        <input type="date" v-model="param.dateSearch1" />
        <span>~</span>
        <input type="date" v-model="param.dateSearch2" />
      </div>

      <div>
        <a class="btn btn-primary">
          <span @click="search">검 색</span>
        </a>
        <a class="btn btn-light">
          <span @click="reset">초기화</span>
        </a>
      </div>
    </div>
  </div>

  <div class="my-5">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="4%" />
        <col width="6%" />
        <col width="6%" />
        <col width="6%" />
        <col width="6%" />
        <col width="4%" />
        <col width="4%" />
        <col width="8%" />
      </colgroup>

      <thead>
        <tr>
          <th scope="col">주문번호</th>
          <th scope="col">주문일자</th>
          <th scope="col">고객명</th>
          <th scope="col">주문수</th>
          <th scope="col">총 금액</th>
          <th scope="col">반품요청</th>
          <th scope="col">입금</th>
          <th scope="col">지시서</th>
        </tr>
      </thead>

      <!-- 일별 수주내역 Data 영역 -->
      <tbody>
        <template v-if="orders.length == 0">
          <tr>
            <td colspan="8">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
        <template v-else>
          <tr
            @click="purchaseDetail(item.pur_id)"
            v-for="item in orders"
            :key="item.pur_id"
          >
            <td>{{ item.pur_id }}</td>
            <td>{{ item.purdate }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.pur_cnt_total }}</td>
            <td>{{ item.total_price }}</td>
            <td>{{ item.returnYN }}</td>
            <td>{{ item.depositYN }}</td>
            <td>
              <button class="btn btn-secondary">작성</button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <pagination
      class="mt-4 justify-content-center"
      :v-model="param.currentPage"
      :page-count="param.totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="clickPageCallBack"
      :prev-text="'이전'"
      :next-text="'다음'"
      :prev-class="'prev'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </pagination>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next";
import { openModal } from "jenesius-vue-modal";
import OrderDetail from "@/components/scm/OrderDetail";
//import BFormDatepicker from "bootstrap-vue";
export default {
  data: () => {
    return {
      param: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPage: 1,
        selectsearch: null,
        typeOfDate: "",
        dateSearch1: "",
        dateSearch2: "",
      },
      orders: [],
    };
  },
  components: {
    pagination: Paginate,
  },
  created: function () {
    this.emitter.on("requestOrdersList", () => {
      this.getList(this.param.currentPage);
    });
  },
  mounted: function () {
    this.getList(1);
  },
  methods: {
    getList(selectPage) {
      this.param.currentPage = selectPage || 1;
      if (this.param.dateSearch1 && this.param.dateSearch2) {
        this.param.selectsearch = "fullchoiced";
      } else {
        this.reset();
      }
      let vm = this;
      this.axios
        .post("/scm/vue/dailyorders", new URLSearchParams(vm.param))
        .then((resp) => {
          let data = resp.data;
          console.log(data);
          vm.param.currentPage = data.currentPage;
          vm.param.pageSize = data.pageSize;
          vm.param.total = data.total;
          vm.param.totalPage = data.totalPage;

          console.log(vm.param);
          if (data.orders) {
            vm.orders = data.orders;
          } else {
            vm.orders = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    clickPageCallBack: function (pageChosen) {
      this.param.currentPage = pageChosen;
      this.getList(pageChosen);
    },
    search: function () {
      let date_start = this.param.dateSearch1;
      let date_end = this.param.dateSearch2;
      if ((date_start == "" && date_end) || (date_start && date_end == "")) {
        alert("날짜를 선택하세요");
      } else {
        if (date_start > date_end) {
          let tempDate = date_start;
          this.param.dateSearch1 = date_end;
          this.param.dateSearch2 = tempDate;
        }
        this.getList(1);
      }
    },
    purchaseDetail: function (idx) {
      openModal(OrderDetail, { idx: idx });
    },
    reset: function () {
      console.log("reset start");
      this.param.selectsearch = null;
      this.param.dateSearch1 = "";
      this.param.dateSearch2 = "";
    },
  },
};
</script>

<style scoped>
#searchWrap {
  padding: 0 24px;

  margin-bottom: 10px;
  border: 1px solid #e2e6ed;
  background: #f9fafb;
}
#searchWrap #banner {
  font-family: "나눔바른고딕", NanumBarunGothic;
  line-height: 60px;
  font-size: 28px;
  font-weight: bold;
}
</style>
