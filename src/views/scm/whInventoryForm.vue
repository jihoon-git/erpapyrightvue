<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">거래내역</span>
    <span class="btn_nav bold">창고별 재고 현황</span>
    <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>창고별 재고 현황</span>
    <span class="fr d-flex">
      <select v-model="param.searchgrouptype" class="form-control h-auto mx-2">
        <option value="">전체</option>
        <option value="0">창고 명</option>
        <option value="1">제품 명</option>
      </select>
      <input
        type="text"
        class="form-control"
        v-model="param.searchtext"
        style="width: 200px"
      />
      <button class="btn btn-primary mx-2">검 색</button>
      <button class="btn btn-light mx-2">초기화</button>
    </span>
  </p>

  <div class="mt-5">
    <table class="col">
      <thead>
        <tr>
          <th scope="col">창고 코드</th>
          <th scope="col">창고명</th>
          <th scope="col">총 재고량</th>
          <th scope="col">지역</th>
          <th scope="col">주소</th>
        </tr>
      </thead>
      <tbody v-if="param.total > 0" id="whlist">
        <template v-for="item in inventories" :key="item.wh_id">
          <tr
            :class="item.wh_id == inventorySelected ? 'blur' : ''"
            @click="inventoryDetail(item.wh_id)"
          >
            <td>{{ item.wh_id }}</td>
            <td>{{ item.wh_nm }}</td>
            <td>{{ item.st_cnt }}</td>
            <td>{{ item.wh_loc }}</td>
            <td>{{ item.addr }}</td>
          </tr>
          <template v-if="item.wh_id == inventorySelected">
            <tr>
              <StocksDetail :detail="detail"> </StocksDetail>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>

  <Pagination
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
  </Pagination>
</template>

<script>
import Paginate from "vuejs-paginate-next";
import StockDetail from "@/components/scm/StocksDetail.vue";
export default {
  data: function () {
    return {
      param: {
        searchgrouptype: "",
        searchtext: "",
        currentPage: 1,
        pageSize: 5,
        totalPage: 1,
        total: 0,
      },
      inventories: [],
      detail: [],
      inventorySelected: 0,
    };
  },
  components: { Pagination: Paginate, StocksDetail: StockDetail },
  created: function () {
    this.getInventories();
  },
  methods: {
    getInventories: function (selectPage) {
      selectPage = selectPage || 1;
      let vm = this;
      vm.param.currentPage = selectPage;
      console.log(vm.param);
      this.axios
        .post("/scm/vue/inventories", new URLSearchParams(vm.param))
        .then((resp) => {
          let data = resp.data;
          console.log(data);
          vm.param.total = data.total;
          vm.param.currentPage = data.currentPage;
          vm.param.totalPage = data.totalPage;
          vm.inventories = data.inventories;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    clickPageCallBack: function (pageChosen) {
      this.getInventories(pageChosen);
    },
    inventoryDetail: function (idx) {
      let vm = this;

      if (vm.inventorySelected == idx) {
        vm.inventorySelected = 0;
      } else {
        this.axios
          .post("/scm/vue/stocks/" + idx)
          .then((resp) => {
            let data = resp.data;
            console.log(data);
            vm.detail = data.detail;
            vm.inventorySelected = idx;
            console.log(data.detail);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    reset: function () {
      this.param.searchgrouptype = "";
      this.param.searchtext = "";
    },
  },
};
</script>

<style scoped>
#searchGroup {
  width: 50%;
  height: 35px;
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
}
#searchGroup > select {
  height: auto;
}
#detailArea {
  margin: 20px auto;
  padding: 0;
  animation: showUp 0.7s ease-out;
}
#whlist > tr {
  cursor: pointer;
}
#whlist > tr.blur {
  animation: blur normal 2s infinite ease-in-out;
}
@keyframes blur {
  0% {
    background-color: white;
  }
  50% {
    background-color: #fafa5f;
  }
  100% {
    background-color: white;
  }
}
@keyframes showUp {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.fr {
  display: flex;
}
</style>
