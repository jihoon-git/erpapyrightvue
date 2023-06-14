<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">거래내역</span>
    <span class="btn_nav bold">반품 신청 목록</span>
    <a href="" class="btn_set refresh">새로고침</a>
  </p>

  <div class="conTitle d-flex">
    <span class="flex-grow-1">반품 신청 목록</span>
    <div class="input-group" id="searchArea">
      <input
        type="text"
        v-model="param.searchinput"
        placeholder="제품명"
        class="mx-2"
      />
      <input type="date" v-model="param.datesearch1" />
      <span class="input-group-text input-text">~</span>
      <input type="date" v-model="param.datesearch2" />
      <button
        class="btn btn-primary mx-2"
        @click="getRefunds(param.currentPage)"
      >
        검 색
      </button>
      <button class="btn btn-light mx-2" @click="reset">초기화</button>
    </div>
  </div>

  <div class="mt-5">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="10%" />
        <col width="20%" />
        <col width="30%" />
        <col width="10%" />
        <col width="20%" />
      </colgroup>

      <thead>
        <tr>
          <th scope="col">반품번호</th>
          <th scope="col">반품 제품명</th>
          <th scope="col">반품 신청날짜</th>
          <th scope="col">반품 수량</th>
          <th scope="col">반품 금액</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="param.total == 0">
          <tr>
            <td colspan="5" class="text-center">
              <strong>일치하는 검색 결과가 없습니다</strong>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="(item, index) in param.refunds" :key="index">
            <td>{{ item.refundInfo.refundInfoId }}</td>
            <td>{{ item.sales.salesName }}</td>
            <td>{{ item.wantedDate }}</td>
            <td>{{ item.refundInfo.returnCnt }}</td>
            <td>{{ item.refundInfo.cnt_total }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <PageNavi
    class="mt-4 justify-content-center"
    :v-model="param.currentPage"
    :page-count="param.totalPage"
    :page-range="5"
    :margin-pages="0"
    :click-handler="getRefunds"
    :prev-text="'이전'"
    :next-text="'다음'"
    :prev-class="'prev'"
    :container-class="'pagination'"
    :page-class="'page-item'"
  >
  </PageNavi>
</template>

<script>
import Paginate from "vuejs-paginate-next";

export default {
  data: function () {
    return {
      param: {
        currentPage: 1,
        totalPage: 1,
        total: 0,
        pageSize: 5,
        searchinput: "",
        datesearch1: "",
        datesearch2: "",
        refunds: [],
      },
    };
  },
  components: {
    PageNavi: Paginate,
  },
  created: function () {
    this.getRefunds();
  },
  methods: {
    getRefunds: function (selectPage) {
      this.param.currentPage = selectPage || 1;
      let vm = this;
      let dateFrom = vm.param.datesearch1;
      let dateTo = vm.param.datesearch2;

      if (dateFrom > dateTo) {
        vm.param.datesearch2 = dateFrom;
        vm.param.datesearch1 = dateTo;
      }
      this.axios
        .get("/scm/vue/refunds/?" + new URLSearchParams(vm.param).toString())
        .then((resp) => {
          let data = resp.data;
          console.log(data);
          vm.param = data.param;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
  reset: function () {
    this.param.searchinput = "";
    this.param.datesearch1 = "";
    this.param.datesearch2 = "";
  },
};
</script>

<style scoped>
.conTitle {
  padding: 0 24px;
  height: 60px;
  margin-bottom: 10px;
  border: 1px solid #e2e6ed;
  background: #f9fafb;
}
.conTitle > span:first-child {
  font-family: "나눔바른고딕", NanumBarunGothic;
  line-height: 60px;
  font-size: 28px;
  font-weight: bold;
}
#searchArea {
  width: auto;
  height: 40px;
  margin: auto;
}
.input-text {
  background-color: #f9fafb;
  border: 0;
}
</style>
