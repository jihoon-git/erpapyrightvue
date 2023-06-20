<template>
  <div id="contractDetailePop" class="layerType2" style="width: 800px">
    <dl>
      <dt id="titledt"></dt>

      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="15%" />
            <col width="35%" />
            <col width="15%" />
            <col width="35%" />
          </colgroup>

          <tbody>
            <tr id="clcom">
              <th colspan="2">
                {{ clientName }}
              </th>
              <th colspan="2">
                {{ homeName }}
              </th>
            </tr>

            <tr>
              <!-- 목록조회 외에 UPDATE, INSERT , DELETE 등을 위해 필요함  hidden 값  // INT가 아닌것도 있음  -->
              <td hidden="">
                {{ estimate_no }}
              </td>
              <!-- 목록조회 외에 UPDATE, INSERT , DELETE 등을 위해 필요함  hidden 값  // INT가 아닌것도 있음  -->
              <td hidden="">
                {{ slip_no }}
              </td>

              <th scope="row">사업자등록번호</th>
              <td>
                {{ clintPermitNo }}
              </td>

              <th scope="row">사업자등록번호</th>
              <td>
                {{ homePermitNo }}
              </td>
            </tr>

            <tr>
              <th scope="row">담당자</th>
              <td>
                {{ clintManagerName }}
              </td>
              <th scope="row">담당자</th>
              <td>
                {{ homeManagerName }}
              </td>
            </tr>

            <tr>
              <th scope="row">주소</th>
              <td>
                {{ clintAddr }}
              </td>
              <th scope="row">주소</th>
              <td>
                {{ homeAddr }}
              </td>
            </tr>
            <tr>
              <th scope="row">나머지 주소</th>
              <td>
                {{ clintDetAddr }}
              </td>
              <th scope="row">나머지주소</th>
              <td>
                {{ homeDetAddr }}
              </td>
            </tr>
            <tr>
              <th scope="row">TEL</th>
              <td>
                {{ clintManagerHp }}
              </td>
              <th scope="row">TEL</th>
              <td>
                {{ homeManagerHp }}
              </td>
            </tr>

            <!-- 거래처 + erp 회사 정보 끝 -->

            <!--  한 칸 띄우기  -->
            <tr>
              <td colspan="4" class="inputTxt p100"></td>
            </tr>

            <tr>
              <td scope="row" colspan="4">
                <br />
                1. 귀사의 일익 번창하심을 기원합니다. <br />
                2.하기와 같이 견적드리오니 검토하기 바랍니다.<br />
              </td>
            </tr>
            <tr></tr>

            <tr>
              <th scope="row" class="han_money" id="han_money">합 계</th>
              <td>{{ txt_money }}원</td>
            </tr>
          </tbody>
        </table>

        <table class="col" style="width: 800px">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
          </colgroup>

          <thead>
            <tr>
              <th scope="col">제품이름</th>
              <th scope="col" id="oeCnts">수량</th>
              <th scope="col">부가세</th>
            </tr>
          </thead>
          <tbody id="OemDetailList">
            <tr>
              <td scope="col" style="font-weight: bold">
                {{ product_name }}
              </td>
              <td scope="col" style="font-weight: bold">
                {{ stock }}
              </td>
              <td scope="col" style="font-weight: bold">
                {{ $comma(tax) }}
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th scope="col">단가</th>
              <th scope="col">공급가액</th>
              <th scope="col">총액</th>
            </tr>
          </thead>
          <tbody id="OemDetailList">
            <tr>
              <td scope="col" style="font-weight: bold">
                {{ $comma(price) }}
              </td>
              <td scope="col" style="font-weight: bold">
                {{ $comma(amt_price) }}
              </td>
              <td scope="col" style="font-weight: bold">
                {{ $comma(total_price) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <!--  <a href="" class="btnType blue" id="btnUpdateOem2" name="btn"><span>저장</span></a> -->
          <a
            href=""
            @click.prevent="close()"
            class="btnType gray"
            id="btnCloseOem"
            name="btn"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>

    <a href="" @click.prevent="close()" class="closePop"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>

<script>
import { closeModal } from 'jenesius-vue-modal';
export default {
  props: { Morder_cd: String, Mproduct_no: Number },
  data: function () {
    return {
      order_cd: '',
      product_no: '',
      clientName: '',
      homeName: '',
      slip_no: '',
      estimate_no: '',
      clintPermitNo: '',
      homePermitNo: '',
      clintManagerName: '',
      homeManagerName: '',
      clintAddr: '',
      homeAddr: '',
      clintDetAddr: '',
      homeDetAddr: '',
      clintManagerHp: '',
      homeManagerHp: '',

      txt_money: '',
      product_name: '',
      stock: '',
      tax: '',
      price: '',
      amt_price: '',
      total_price: '',
    };
  },
  created() {
    this.order_cd = this.Morder_cd;
    this.product_no = this.Mproduct_no;
    console.log('dddddd:' + this.Morder_cd);
    this.fn_Detail();
  },
  methods: {
    fn_Detail: function () {
      console.log('상세보기 함수 안');
      let vm = this;
      let params = new URLSearchParams();
      params.append('order_cd', vm.order_cd);
      params.append('product_no', vm.product_no);
      console.log('====vm.order_cd :' + vm.order_cd);
      this.$vuecombiListAxios('business/contractDetaile.do', params).then(
        (response) => {
          console.log('response : ' + JSON.stringify(response));
          vm.clientName = response.data.contractDetaile[0].client_name;
          vm.homeName = response.data.contractDetaile[0].home_name;
          vm.clintPermitNo = response.data.contractDetaile[0].clint_permit_no;
          vm.homePermitNo = response.data.contractDetaile[0].home_permit_no;
          vm.clintManagerName =
            response.data.contractDetaile[0].clint_manager_name;
          vm.homeManagerName =
            response.data.contractDetaile[0].home_manager_name;
          vm.clintAddr = response.data.contractDetaile[0].clint_addr;
          vm.homeAddr = response.data.contractDetaile[0].home_addr;
          vm.clintDetAddr = response.data.contractDetaile[0].clint_det_addr;
          vm.homeDetAddr = response.data.contractDetaile[0].home_det_addr;
          vm.clintManagerHp = response.data.contractDetaile[0].clint_manager_hp;
          vm.homeManagerHp = response.data.contractDetaile[0].home_manager_hp;

          vm.product_name = response.data.contractDetaile[0].product_name;
          vm.stock = response.data.contractDetaile[0].stock;
          vm.tax = response.data.contractDetaile[0].tax;
          vm.price = response.data.contractDetaile[0].price;
          vm.amt_price = response.data.contractDetaile[0].amt_price;
          vm.total_price = response.data.contractDetaile[0].total_price;
          vm.txt_money = this.convertToKoreanNumber(vm.total_price);
        }
      );
    },
    convertToKoreanNumber: function (num) {
      let result = '';
      let digits = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
      let units = [
        '',
        '십',
        '백',
        '천',
        '만',
        '십',
        '백',
        '천',
        '억',
        '십',
        '백',
        '천',
        '조',
        '십',
        '백',
        '천',
      ];
      let numStr = String(num); // 문자열로 변환
      let numLen = numStr.length; // 문자열의 길이

      for (let i = 0; i < numLen; i++) {
        let digit = parseInt(numStr.charAt(i)); // i번째 자릿수 숫자
        let unit = units[numLen - i - 1]; // i번째 자릿수 단위

        // 일의 자리인 경우에는 숫자를 그대로 한글로 변환
        if (i === numLen - 1 && digit === 1 && numLen !== 1) {
          result += '일';
        } else if (digit !== 0) {
          // 일의 자리가 아니거나 숫자가 0이 아닐 경우
          result += digits[digit] + unit;
        } else if (i == numLen - 5) {
          // 십만 단위에서는 '만'을 붙이지 않습니다.
          result += '만';
        }
      }

      return result;
    },
    close: function () {
      closeModal();
    },
  },
};
</script>
