<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>

    <span class="btn_nav bold">기준정보</span>
    <span class="btn_nav bold">창고 정보 관리</span>

    <a href="/scm/whinfo.do" class="btn_set refresh">새로고침</a>
  </p>
  <whList></whList>
</template>

<script>
import whList from "@/components/scm/WhList.vue";

export default {
  data: () => {
    return {};
  },
  components: { whList },
  mounted: function () {
    console.log("initiate whinfo");
  },
};
</script>

<style scoped>
.searchArea {
  margin-top: 35px;
  padding: 50px 0;
  border: 2px solid rgb(190, 190, 190);
}
#searchBtnWrap {
  display: inline-block;
  margin: 0 10px;
}
#whListArea {
  margin-bottom: 30px;
}
#whListArea table,
#whInfoArea table {
  margin: 0 auto;
}

#btn-close-daum {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 11;
  cursor: pointer;
}

#formwrap {
  margin-top: 50px;
  margin-bottom: 50px;
  border: 2px solid rgb(190, 190, 190);
  padding-left: 50px;
}
#formwrap #formtable {
  border-collapse: separate;
  border-spacing: 10px 10px;
  margin: 10px auto;
}
#formwrap #phoneArea input {
  width: 100px;
}
</style>
