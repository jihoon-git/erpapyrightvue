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
    <template v-for="itemone in items" :key="itemone.laccount_cd">
      <option :value="itemone.laccount_cd">
        {{ itemone.account_name }}
      </option>
    </template>
  </select>
</template>

<script>
export default {
  // vue에서는 받아온 변수를 methods에서 직접 핸들링이 불가능하기 때문에
  // 임시 변수를 만들어서 받아온 변수를 넣어 줘야 함
  props: {
    laccount_cd: String,
    selectid: String,
    type: String,
    selvalue: String,
    eventid: String,
  },
  data: function () {
    return {
      items: [],
      defaultvalue: '',
      sid: '',
      countCd: this.laccount_cd,
    };
  },
  watch: {
    laccount_cd() {
      const vm = this;
      vm.countCd = vm.laccount_cd;
      this.detaillist(vm.countCd);
    },
  },
  methods: {
    detaillist: function (val) {
      let vm = this;
      this.sid = this.selectid;
      alert(val);
      //  수정 시 (grp_cod 에 해당하는 상세코드 정보 가져오기)
      let params = new URLSearchParams();
      params.append('laccount_cd', this.laccount_cd);
      console.log('detileAccount params 확인 ' + params);
      console.log('detileAccount laccount_cd 확인 ' + this.laccount_cd);
      this.axios
        .post('/accounting/detileAccountList.do', params)
        .then(function (response) {
          console.log('detileAccount Json 값 : ' + JSON.stringify(response));
          console.log(
            'detileAccount List 값 : ' +
              JSON.stringify(response.data.detileAccountList)
          );

          vm.items = response.data.detileAccountList;
          vm.defaultvalue = vm.selvalue;

          console.log(
            'vm.defaultvalue : ' +
              vm.defaultvalue +
              ' vm.selvalue : ' +
              vm.selvalue
          );
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });

      this.emitter.on(this.eventid, (params) => {
        //alert('event : ' + this.eventid + ' : ' + params);
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
