<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">기준정보</span>
    <span class="btn_nav bold">납품업체 관리</span>
    <a @click.prevent="$router.go(0)" class="btn_set refresh">새로고침</a>
  </p>
  <!-- SearchArea -->
  <div id="searchArea">
    <!-- <table style="margin-top: 10px" width="100%" cellpadding="5" cellsapcing="0" border="1">
            <tr style="border: 0px; border-color: blue">
                <td width="80" height="25" style="font-size: 120%;">&nbsp;&nbsp;</td>
                <td width="50" height="25" style="font-size: 100%; text-align:left; padding-right:25px;"> -->

    <div class="d-flex justify-content-around">
      <select class="form-control h-auto" v-model="page.searchType">
        <option value="all">전체</option>
        <option value="comp_nm">회사명</option>
        <option value="sales_nm">제품명</option>
      </select>

      <input
        type="text"
        class="form-control"
        style="width: 50%"
        v-model="page.keyword"
        @keydown="search"
      />
      <button
        type="button"
        class="btn btn-primary"
        @click="getSupplierList(page.selectPage)"
      >
        검색
      </button>
    </div>
  </div>
  <!-- Supplier List Area -->
  <div id="suppliers" class="mt-5">
    <table class="col">
      <thead>
        <tr>
          <th scope="col">업체코드</th>
          <th scope="col">납품업체명</th>
          <th scope="col">아이디</th>
          <th scope="col">패스워드</th>
          <th scope="col">담당자명</th>
          <th scope="col">연락처</th>
        </tr>
      </thead>
      <tbody>
        <!-- <c:if test="${empty page.suppliers}"> -->
        <template v-if="page.suppliers == null">
          <tr>
            <td colspan="6" class="text-center">납품회사 정보가 업습니다</td>
          </tr>
        </template>
        <!-- </c:if> -->
        <template v-else>
          <!-- <c:if test="${not empty page.suppliers}"> -->
          <!-- <c:forEach items="${page.suppliers}" var="s"> -->
          <tr
            v-for="comp in page.suppliers"
            :key="comp.comp_id"
            @click="getImpSales(comp.comp_id, comp.comp_nm)"
          >
            <td>{{ comp.comp_id }}</td>
            <td>{{ comp.comp_nm }}</td>
            <td>{{ comp.loginID }}</td>
            <td>{{ comp.password }}</td>
            <td>{{ comp.name }}</td>
            <td>{{ comp.phone }}</td>
          </tr>
          <!-- </c:forEach> -->
          <!-- </c:if> -->
        </template>
      </tbody>
    </table>

    <PageNavi
      class="mt-4 justify-content-center"
      :v-model="page.selectPage"
      :page-count="page.totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="clickPageCallBack"
      :prev-text="'이전'"
      :next-text="'다음'"
      :prev-class="'prev'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </PageNavi>
  </div>

  <ImpSales :supplier="supplier"></ImpSales>
</template>

<script>
import ImpSales from '@/components/scm/ImpSales.vue';
import PageNavi from 'vuejs-paginate-next';

export default {
  data: function () {
    return {
      page: {
        selectPage: 1,
        rowsPerPage: 5,
        searchType: 'all',
        keyword: '',
        totalCount: 0,
        totalPage: 1,
        suppliers: [],
      },
      supplier: {
        name: '',
        impSales: [],
      },
    };
  },
  components: { PageNavi: PageNavi, ImpSales },
  created: function () {
    this.getSupplierList();
  },
  methods: {
    getSupplierList: function (selectPage) {
      selectPage = selectPage || 1;
      let vm = this;
      vm.page.selectPage = selectPage;
      this.axios(
        { url: '/scm/vue/suppliers', data: vm.page, method: 'post' },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
        // .post('/scm/vue/suppliers', JSON.stringify(vm.page))
        .then((resp) => {
          let data = resp.data;
          console.log(data);
          vm.page.selectPage = data.page.selectPage;
          vm.page.totalCount = data.page.totalCount;
          vm.page.totalPage = data.page.totalPage;
          vm.page.suppliers = data.page.suppliers;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    clickPageCallBack: function (pageChosen) {
      this.getSupplierList(pageChosen);
    },
    getImpSales: function (id, supplierName) {
      let vm = this;
      this.axios
        .post('/scm/vue/supplier/' + id)
        .then((resp) => {
          let data = resp.data;
          console.log(resp);
          vm.supplier.name = supplierName;
          vm.supplier.impSales = data.impSales;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    search: function (event) {
      if (event.keyCode == 13) {
        this.getSupplierList(this.page.selectPage);
      }
    },
  },
};
</script>

<style scoped>
#searchArea {
  margin-top: 35px;
  padding: 50px 0;
  border: 2px solid rgb(190, 190, 190);
}
#suppliers > table > tbody > tr {
  cursor: pointer;
}
#suppliers > table > tbody > tr:hover {
  background-color: #fafa5f;
}
</style>
