<template>
  <p class="Location">
    <a href="/" class="btn_set home">메인으로</a>

    <span class="btn_nav bold">기준정보</span>
    <span class="btn_nav bold">제품 정보 관리</span>

    <a href="/scm/productMng.do" class="btn_set refresh">새로고침</a>
  </p>
  <!-- SearchArea -->
  <searchArea></searchArea>

  <div id="salesListWrap">
    <salesList></salesList>
  </div>

  <salesForm></salesForm>
</template>

<script>
import salesList from "@/components/scm/SalesList.vue";
import searchArea from "@/components/scm/SearchForm.vue";
import salesForm from "@/components/scm/SalesForm.vue";

export default {
  components: {
    salesList,
    searchArea,
    salesForm,
  },
  mounted: function () {
    console.log("initiate productMng");
  },
};
</script>

<style scoped>
#st-btn {
  width: 51px;
  height: 51px;
  position: fixed;
  bottom: 30px;
  right: 30px;
  cursor: pointer;
  background-image: url(/images/mainicons.png);
  background-size: 457px 434px;
  background-position: -148px -210px;
  background-repeat: no-repeat;
}

.searchArea {
  margin-top: 35px;
  padding: 50px 0;
  border: 2px solid rgb(190, 190, 190);
}
#searchBtnWrap {
  display: inline-block;
  margin: 0 10px;
}
#salesListArea {
  margin-bottom: 30px;
}
#salesListArea table,
#salesInfoArea table {
  margin: 0 auto;
}
#formwrap {
  margin-top: 50px;
  margin-bottom: 50px;
  border: 2px solid rgb(190, 190, 190);
  padding-left: 50px;
}

#salesInfoArea {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

#salesInfoArea table {
  border-collapse: separate;
  border-spacing: 5px 10px;
}
#salesImgArea {
  display: flex;
  flex-direction: column;
  position: relative;
}
#shortImages {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 10px;
  height: 80px;
  width: 200px;
  padding: 10px;
  overflow-x: scroll;
  white-space: nowrap;
}
#shortImages img {
  width: 50px;
  height: 50px;
  margin: 0 5px;
}
#formwrap ::-webkit-scrollbar {
  background-color: white;
  height: 10px;
}
#formwrap ::-webkit-scrollbar-thumb {
  background-color: rgb(197, 197, 197);
  border-radius: 10px;
}

#l_files {
  position: absolute;
  top: 20px;
  width: 15px;
  height: 15px;
  background: url(/images/treeview/plus.gif);
  background-repeat: no-repeat;
  background-position: 1px 1px;
  background-size: 15px 15px;
}
#files {
  visibility: hidden;
}
#salesInfoArea #representPhoto {
  width: 200px;
  height: 200px;
  margin-top: 20px;
}
#dtInfoArea {
  height: 200px;
}
#area-left,
#area-right {
  flex: 1 1 auto !important;
}
</style>
