<template>
  <td colspan="5">
    <div id="detailArea">
      <table class="col">
        <thead>
          <tr>
            <th scope="col">분류</th>
            <th scope="col">상품명</th>
            <th scope="col">재고량</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(salesItem, index) in detail" :key="index">
            <td>{{ salesItem.sales_type }}</td>
            <td>{{ salesItem.sales_nm }}</td>
            <td>{{ salesItem.st_cnt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </td>
</template>

<script>
export default {
  props: { detail: Array },
  data: function () {
    return {
      stockDetail: {},
    };
  },
  created: function () {
    console.log("stocks detail is created");
  },
  destroy: function () {
    console.log("stocks detail is destoryed...");
  },
};
</script>
