<template>
  <div class="searchArea" id="v-SearchArea">
    <div class="form-inline justify-content-around">
      <div class="form-group" id="keyword-group">
        <select
          id="searchKey"
          name="searchKey"
          class="form-control"
          v-model="searchType"
        >
          <option value="all">전체</option>
          <option value="sales_nm">제품명</option>
          <option value="model_nm">모델명</option>
          <option value="mfcomp">제조사</option>
        </select>
      </div>
      <div class="form-group">
        <input
          type="text"
          id="keyword"
          class="form-control mx-sm-3"
          placeholder="검색어를 입력하세요"
          v-model="keyword"
          @keydown="search"
        />
      </div>
      <div class="form-group">
        <button
          type="button"
          class="btn btn-primary"
          id="searchBtn"
          @click="sendParams"
        >
          검색
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      searchType: "all",
      keyword: "",
    };
  },
  methods: {
    getList: function () {
      console.log("called in SearchForm.vue");
      console.log(this.props.selectPage);
    },
    sendParams: function () {
      console.log("sendParams to SalesList.vue....");
      // 이벤트 버스를 사용하여 데이터를 전달한다
      this.emitter.emit("fetchData", this.$data);
    },
  },
};
</script>

<style>
#keyword-group {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
#keyword {
  padding: 5px;
  width: 500px;
}
.content select {
  height: auto;
}
</style>
