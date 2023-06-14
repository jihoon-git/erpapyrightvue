<template>
  <div v-if="Object.keys(supplier.impSales).length > 0">
    <h1 class="banner">{{ supplier.name }}</h1>
    <div class="my-4">
      <table class="col" id="impSalesListTable">
        <thead>
          <tr>
            <th scope="col">제품번호</th>
            <th scope="col">제품명</th>
            <th scope="col">납품단가</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="supplier.impSales == null">
            <td colspan="3" class="text-center">납품 상품이 없습니다</td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in supplier.impSales" :key="index">
              <td>{{ item.sales_id }}</td>
              <td>{{ item.sales_nm }}</td>
              <td>{{ item.unitprice }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: { supplier: Object },
};
</script>

<style>
.banner {
  font-size: 35px;
  font-weight: bold;
}
.banner::after {
  content: "";
  display: block;
  border-top: 1px solid rgb(150, 150, 150);
  margin-top: 15px;
}
</style>
