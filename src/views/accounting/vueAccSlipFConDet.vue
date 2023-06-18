<template>
  <div>
    <p class="conTitle">
      <span>수주 상세 조회</span>
      <span class="fr" style="margin-top: 5px"> </span>
    </p>

    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="5%" />
          <col width="10%" />
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">전표번호</th>
            <th scope="col">수주일자</th>
            <th scope="col">수주번호</th>
            <th scope="col">담당자</th>
            <th scope="col">거래처명</th>
            <th scope="col">제품 대분류</th>
            <th scope="col">제품 중분류</th>
            <th scope="col">제품명</th>
            <th scope="col">단가</th>
            <th scope="col">수량</th>
            <th scope="col">총액</th>
          </tr>
        </thead>
        <tbody
          id="conDetaile"
          v-for="item in conDetaileList"
          :key="item.order_cd"
        >
          <tr>
            <td>{{ item.account_no }}</td>
            <td>{{ item.contract_date }}</td>
            <td>{{ item.order_cd }}</td>
            <td>{{ item.conUserName }}</td>
            <td>{{ item.client_name }}</td>
            <td>{{ item.lcategory_name }}</td>
            <td>{{ item.mproduct_name }}</td>
            <td>{{ item.sproduct_name }}</td>
            <td>{{ $comma(item.price) }}</td>
            <td>{{ item.total_amt }} EA</td>
            <td>{{ $comma(item.total_price) }} 원</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: { conDetItem: String },
  watch: {
    // watch로 부모창에서 보내오는 값의 변화를 감지
    // 값이 바뀔 때마다 자식창의 detOrderCd에 부모창의 conDetItem 넣어주고
    // 상세내역 조회 메서드 contractDetaile() 실행
    conDetItem() {
      //   console.log('-----------');
      //   console.log('item changed');
      //   console.log(this.detOrderCd);
      //   console.log(this.conDetItem);
      this.detOrderCd = this.conDetItem;
      this.contractDetaile();
    },
  },
  data: function () {
    return {
      detOrderCd: '',
      conDetaileList: [],
    };
  },
  created() {
    this.detOrderCd = this.conDetItem;
    this.contractDetaile();
  },
  updated() {
    // updated DOM이 재 렌더링 된 후 호출되는 라이프 사이클 훅
    // 변경 된 후의 DOM을 이용해야 하는 처리를 할 때 사용하기 유용
    // 무한루프에 빠질 수 있으니 주의
    // 변수 하나가 바뀔 때마다 메소드를 실행하고 싶다면 watch를 쓰자
    //this.detOrderCd = this.conDetItem;
    //this.contractDetaile();
  },
  methods: {
    contractDetaile: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('req_no', vm.detOrderCd);
      this.$vuecombiListAxios('/accounting/accSlipDetaile.do', params)
        .then(function (response) {
          vm.conDetaileList = response.data.accSlipDetaile;
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
