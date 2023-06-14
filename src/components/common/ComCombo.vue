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
    <option
      v-for="itemone in items"
      :value="itemone.dtl_cod"
      :key="itemone.dtl_cod"
    >
      {{ itemone.dtl_cod_nm }}
    </option>
  </select>
</template>

<script>
export default {
  // vue에서는 받아온 변수를 methods에서 직접 핸들링이 불가능하기 때문에
  // 임시 변수를 만들어서 받아온 변수를 넣어 줘야 함
  props: {
    group_code: String,
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
    };
  },
  // html 로딩, 가상 dom 실행, 이 두 개 연결 시 작동
  mounted: function () {
    let vm = this;
    this.sid = this.selectid;

    //  수정 시 (grp_cod 에 해당하는 상세코드 정보 가져오기)
    let params = new URLSearchParams();
    params.append('group_code', this.group_code);

    this.axios
      .post('/commonproc/comcombo.do', params)
      .then(function (response) {
        console.log(response);

        vm.items = response.data.list;
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
  methods: {},
  created() {
    // 자식요소에서 부모 요소 method 호출
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
