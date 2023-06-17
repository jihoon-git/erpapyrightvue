<template>
  <div>
    <p class="conTitle">
      <span>지출 상세 조회</span>
      <span class="fr" style="margin-top: 5px"> </span>
    </p>

    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="6%" />
          <col width="10%" />
          <col width="6%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="28%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">전표번호</th>
            <th scope="col">지출승인일자</th>
            <th scope="col">지출번호</th>
            <th scope="col">담당자</th>
            <th scope="col">계정 대분류</th>
            <th scope="col">계정과목</th>
            <th scope="col">지출내용</th>
            <th scope="col">지출비용</th>
          </tr>
        </thead>
        <tbody id="exDetaile" v-for="item in exDetaileList" :key="item.exp_no">
          <tr>
            <td>{{ item.account_no }}</td>
            <td>{{ item.expYn_date }}</td>
            <td>{{ item.exp_no }}</td>
            <td>{{ item.expUserName }}</td>
            <td>{{ item.laccount_name }}</td>
            <td>{{ item.account_name }}</td>
            <template v-if="item.exp_det == null">
              <td>-</td>
            </template>
            <template v-else>
              <td>{{ item.exp_det }}</td>
            </template>
            <td>{{ $comma(item.exp_spent) }} 원</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: { expDetItem: Number },
  watch: {
    detExpNo() {
      this.detExpNo = this.expDetItem;
      this.expDetaile();
    },
  },
  data: function () {
    return {
      detExpNo: '',
      exDetaileList: [],
    };
  },
  mounted() {
    this.detExpNo = this.expDetItem;
    // console.log('============= created');
    // console.log(this.expDetItem);
    // console.log(this.detExpNo);
    this.expDetaile();
  },
  methods: {
    expDetaile: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('req_no', vm.detExpNo);

      this.$vuecombiListAxios('/accounting/accSlipDetaile.do', params)
        .then(function (response) {
          vm.exDetaileList = response.data.accSlipDetaile;
          //   console.log('axious=========================');
          //   console.log(JSON.stringify(response));
          //   console.log(JSON.stringify(response.data.accSlipDetaile));
          //   console.log(vm.exDetaileList);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    // modalClose: function () {
    //   this.emitter.emit('close', 'Bye');
    // },
  },
};
</script>
