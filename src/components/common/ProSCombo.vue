<template>
  <select
    :id="sid"
    :name="sid"
    v-model="defaultvalue"
    :modelvalue="defaultvalue"
  >
    <template v-if="type == 'all'">
      <option value="">전체</option>
    </template>
    <template v-else>
      <option value="">선택</option>
    </template>
    <template v-for="itemone in items" :key="itemone.mcategory_cd">
      <option :value="itemone.product_no">
        {{ itemone.product_name }}
      </option>
    </template>
  </select>
</template>

<script>
export default {
  // vue에서는 받아온 변수를 methods에서 직접 핸들링이 불가능하기 때문에
  // 임시 변수를 만들어서 받아온 변수를 넣어 줘야 함
  props: {
    lcategory_cd: String,
    mcategory_cd: String,
    selectid: String,
    type: String,
    selvalue: String,
    eventid: String,
  },
  data: function () {
    return {
      items: [],
      defaultvalue: "",
      sid: "",
      testCd: this.lcategory_cd,
      test2Cd: this.mcategory_cd,
    };
  },
  watch: {
    mcategory_cd() {
      const vm = this;
      vm.testCd = vm.lcategory_cd;
      vm.test2Cd = vm.mcategory_cd;
      //alert("ProSCombo : " + vm.testCd + vm.test2Cd);
      this.detaillist(vm.testCd, vm.test2Cd);
    },
  },
  mounted() {
    this.detaillist();
  },
  // html 로딩, 가상 dom 실행, 이 두 개 연결 시 작동
  methods: {
    detaillist: function () {
      console.log("S 들어옴? ");
      console.log(this.lcategory_cd);
      console.log(this.mcategory_cd);
      let vm = this;
      this.sid = this.selectid;

      //  수정 시 (grp_cod 에 해당하는 상세코드 정보 가져오기)
      let params = new URLSearchParams();
      params.append("lcategory_cd", this.lcategory_cd);
      params.append("mcategory_cd", this.mcategory_cd);

      console.log("소: " + JSON.stringify(params));
      this.axios
        .post("/accounting/productList.do", params)
        .then(function (response) {
          //console.log("S JSON 확인 :  ");
          //console.log(response);

          vm.items = response.data.productList;
          vm.defaultvalue = vm.selvalue;

          console.log(
            "vm.defaultvalue : " +
              vm.defaultvalue +
              " vm.selvalue : " +
              vm.selvalue
          );
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });

      this.emitter.on(this.eventid, (params) => {
        //alert("event : " + this.eventid + " : " + params);
        this.defaultvalue = params;
      });
    },
  },
};
</script>

<style>
#grpInfo {
  border-collapse: separate;
  border-spacing: 20px;
}
#grpInfoWrap {
  background-color: #fff;
  padding: 3rem;
  border-radius: 10px;
  border: 2px solid rgb(59, 59, 59);
}
</style>
