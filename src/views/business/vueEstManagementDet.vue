<template>
  <div id="modalEstdetail" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>견적서 상세조회</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="120px" />
            <col width="120px" />
            <col width="120px" />
            <col width="120px" />
            <col width="120px" />
            <col width="120px" />
          </colgroup>

          <tbody>
            <tr>
              <th colspan="3" scope="row">
                {{ detail_clnm }}
              </th>
              <th colspan="3" scope="row">
                {{ detail_cnm }}
              </th>
            </tr>
            <tr>
              <th scope="row">사업자등록번호</th>
              <td colspan="2">
                {{ detail_clno }}
              </td>
              <th scope="row">사업자등록번호</th>
              <td colspan="2">
                {{ detail_cno }}
              </td>
            </tr>

            <tr>
              <th scope="row">담당자</th>
              <td colspan="2">
                {{ detail_clmnm }}
              </td>
              <th scope="row">담당자</th>
              <td colspan="2">
                {{ detail_cmnm }}
              </td>
            </tr>

            <tr>
              <th scope="row">주소</th>
              <td colspan="2">
                {{ detail_claddr }}
              </td>
              <th scope="row">주소</th>
              <td colspan="2">
                {{ detail_caddr }}
              </td>
            </tr>

            <tr>
              <th scope="row">나머지주소</th>
              <td colspan="2">
                {{ detail_cldaddr }}
              </td>
              <th scope="row">나머지주소</th>
              <td colspan="2">
                {{ detail_cdaddr }}
              </td>
            </tr>

            <tr>
              <th scope="row">TEL</th>
              <td colspan="2">
                {{ detail_clmhp }}
              </td>
              <th scope="row">TEL</th>
              <td colspan="2">
                {{ detail_cmhp }}
              </td>
            </tr>

            <tr>
              <th scope="row">견적작성일</th>
              <td colspan="5">
                {{ detail_date }}
              </td>
            </tr>

            <tr>
              <th scope="col">제품명</th>
              <th scope="col">단가</th>
              <th scope="col">수량</th>
              <th scope="col">공급가액</th>
              <th scope="col">부가세</th>
              <th scope="col">합계</th>
            </tr>

            <tr>
              <td>
                {{ detail_nm }}
              </td>
              <td>
                {{ $comma(detail_price) }}
              </td>
              <td>{{ detail_amt }} EA</td>
              <td>
                {{ $comma(detail_amt_price) }}
              </td>
              <td>
                {{ $comma(detail_tax) }}
              </td>
              <td>
                {{ $comma(detail_total) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="tmpClose"
            class="btnType gray"
            id="btnClose"
            name="btn"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" @click.prevent="tmpClose" class="closePop"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>
<script>
export default {
  props: { estDetConNo: Number },
  data: function () {
    return {
      detail_clnm: '',
      detail_cnm: '',
      detail_clno: '',
      detail_cno: '',
      detail_clmnm: '',
      detail_cmnm: '',
      detail_claddr: '',
      detail_caddr: '',
      detail_cldaddr: '',
      detail_cdaddr: '',
      detail_clmhp: '',
      detail_cmhp: '',
      detail_date: '',
      detail_nm: '',
      detail_price: '',
      detail_amt: '',
      detail_amt_price: '',
      detail_tax: '',
      detail_total: '',
      detContractNo: '',
    };
  },
  created() {
    this.detContractNo = this.estDetConNo;
    this.estdetail();
    // console.log('자식창 created');
    // console.log(this.detContractNo);
    // console.log(this.estDetConNo);
  },
  methods: {
    estdetail: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('contract_no', vm.detContractNo);
      this.$vuecombiListAxios('/business/estdetail.do', params)
        .then(function (response) {
          //   console.log('==============axois');
          //   console.log(response.data.estdetail.clnm);
          vm.detail_clnm = response.data.estdetail.clnm;
          vm.detail_cnm = response.data.estdetail.cnm;
          vm.detail_clno = response.data.estdetail.clno;
          vm.detail_cno = response.data.estdetail.cno;
          vm.detail_clmnm = response.data.estdetail.clmnm;
          vm.detail_cmnm = response.data.estdetail.cmnm;
          vm.detail_claddr = response.data.estdetail.claddr;
          vm.detail_caddr = response.data.estdetail.caddr;
          vm.detail_cldaddr = response.data.estdetail.cldaddr;
          vm.detail_cdaddr = response.data.estdetail.cdaddr;
          vm.detail_clmhp = response.data.estdetail.clmhp;
          vm.detail_cmhp = response.data.estdetail.cmhp;
          vm.detail_date = response.data.estdetail.contract_date;
          vm.detail_nm = response.data.estdetail.product_name;
          vm.detail_price = response.data.estdetail.price;
          vm.detail_amt = response.data.estdetail.product_amt;
          vm.detail_amt_price = response.data.estdetail.amt_price;
          vm.detail_tax = response.data.estdetail.tax;
          vm.detail_total = response.data.estdetail.total_price;
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    tmpClose: function () {
      this.emitter.emit('close');
    },
  },
};
</script>
