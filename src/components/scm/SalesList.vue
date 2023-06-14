<template>
  <div id="salesListArea" class="bts">
    <div class="bts mt10">
      <div class="salesMngBtnArea text-right">
        <button
          type="button"
          class="btn btn-primary"
          id="btnNewSales"
          @click="getInfo('NEW')"
        >
          제품 등록
        </button>
      </div>
    </div>

    <div class="bts mt30">
      <table class="col" id="salesListTable">
        <thead>
          <tr>
            <th scope="col">모델 번호</th>
            <th scope="col">모델명</th>
            <th scope="col">제품번호</th>
            <th scope="col">제품명</th>
            <th scope="col">제조사</th>
            <th scope="col">판매가</th>
          </tr>
        </thead>
        <tbody v-if="salesList == null || salesList.length == 0">
          <tr>
            <td colspan="6" class="text-center">일치하는 상품이 없습니다</td>
          </tr>
        </tbody>
        <tbody v-else v-for="item in salesList" :key="item.sales_id">
          <tr @click="getInfo('INFO', item.sales_id)">
            <td>{{ item.model_code }}</td>
            <td>{{ item.model_nm }}</td>
            <td>{{ item.sales_id }}</td>
            <td>{{ item.sales_nm }}</td>
            <td>{{ item.mfcomp }}</td>
            <td>{{ item.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <paginate
    class="justify-content-center"
    :v-model="selectPage"
    :page-count="totalPage"
    :page-range="5"
    :margin-pages="0"
    :click-handler="clickPageCallBack"
    :prev-text="'이전'"
    :next-text="'다음'"
    :prev-class="'prev'"
    :container-class="'pagination'"
    :page-class="'page-item'"
  ></paginate>
</template>

<script>
import paginate from "vuejs-paginate-next";
// import {EventBus} from "@/components/common/EventBus.vue";

export default {
  data: function () {
    return {
      selectPage: 1,
      rowsPerPage: 5,
      totalCount: 0,
      totalPage: 1,
      keyword: "",
      searchType: "all",
      salesList: [],
    };
  },
  watch: {
    selectPage: function (changed) {
      console.log("selectPage changed..." + changed);
    },
  },
  components: {
    paginate: paginate,
  },
  created: function () {
    this.emitter.on("fetchData", (data) => {
      this.keyword = data.keyword;
      this.searchType = data.searchType;
      this.getList(this.selectPage);
    });
    this.emitter.on("refresh", () => {
      this.getList(this.selectPage);
    });
  },
  mounted: function () {
    this.getList();
  },
  methods: {
    getList: function (selectPage) {
      // console.log('called in SalesList.vue');
      selectPage = selectPage || 1;
      let param = {
        selectPage: selectPage,
        rowsPerPage: this.rowsPerPage,
        keyword: this.keyword,
        searchType: this.searchType,
        total: this.totalCount,
        pageblock: 5,
      };
      // console.log(param);
      this.axios
        .post("/scm/vue/saleslist", new URLSearchParams(param))
        .then((resp) => {
          let data = resp.data;
          // console.log(data);
          this.selectPage = data.page.selectPage;
          this.rowsPerPage = data.page.rowsPerPage;
          this.totalCount = data.totalCount;
          this.totalPage = data.page.totalPage;
          this.salesList = data.page.salesList;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    requestExParam: function (param) {
      this.emiiter.emit("requireExParam", (data) => {
        param.keyword = data.keyword;
        param.searchType = data.searchType;
      });
    },
    clickPageCallBack: function (pageChosen) {
      this.selectPage = pageChosen;
      this.getList(pageChosen);
    },
    getInfo: function (action, salesID) {
      // 제품 등록 getInfo => action : NEW , salesID : undefined
      // 제품 보기 getInfo => action : INFO, salesID : 상품 고유번호
      // salesForm.vue 에 인자 전달
      console.log("emit request :key=requestForm");
      this.emitter.emit("requestForm", { action: action, idx: salesID });
    },
  },
};
</script>
