<template>
  <div id="hisdetail" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>급여 상세조회</strong>
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
              <th colspan="2" scope="col">사원명</th>
              <th colspan="2" scope="col">부서</th>
              <th colspan="2" scope="col">직급</th>
            </tr>
            <tr style="text-align: center">
              <td colspan="2" name="detail_hnm" id="detail_hnm">
                {{ detail_hnm }}
              </td>
              <td colspan="2" name="detail_hdept" id="detail_hdept">
                {{ detail_hdept }}
              </td>
              <td colspan="2" name="detail_hrank" id="detail_hrank">
                {{ detail_hrank }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">항목</th>
              <th colspan="3" scope="row">금액(원)</th>
            </tr>

            <tr>
              <th colspan="3" scope="row">연봉</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_ypay"
                id="detail_ypay"
              >
                {{ $comma(detail_ypay) }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">기본급</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_mpay"
                id="detail_mpay"
              >
                {{ $comma(detail_mpay) }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">국민연금</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_nins"
                id="detail_nins"
              >
                {{ $comma(detail_nins) }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">건강보험료</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_hins"
                id="detail_hins"
              >
                {{ $comma(detail_hins) }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">고용보험료</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_iins"
                id="detail_iins"
              >
                {{ $comma(detail_iins) }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">산재보험료</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_eins"
                id="detail_eins"
              >
                {{ $comma(detail_eins) }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">소득세</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_tax"
                id="detail_tax"
              >
                {{ $comma(detail_tax) }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">비고금액</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_extra"
                id="detail_extra"
              >
                {{ $comma(detail_extra) }}
              </td>
            </tr>

            <tr>
              <th colspan="3" scope="row">실수령액</th>
              <td
                colspan="3"
                style="text-align: center"
                name="detail_rpay"
                id="detail_rpay"
              >
                {{ $comma(detail_rpay) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="close()"
            class="btnType gray"
            id="btnClose"
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
//import { vuecombiListAxios } from '../employee';
export default {
  props: {
    myPayDate: String,
  },
  data: function () {
    return {
      myDate: '',
      detail_hnm: '',
      detail_hdept: '',
      detail_hrank: '',

      detail_ypay: '',
      detail_mpay: '',
      detail_nins: '',
      detail_hins: '',
      detail_iins: '',
      detail_eins: '',
      detail_tax: '',
      detail_extra: '',
      detail_rpay: '',
    };
  },
  mounted: function () {
    this.myDate = this.myPayDate;
    this.fn_empPayHistdetail();
  },
  computed: {},
  methods: {
    fn_empPayHistdetail: function () {
      console.log('상세보기');
      let vm = this;
      let params = new URLSearchParams();
      params.append('myDate', vm.myDate);
      this.$vuecombiListAxios('employee/empPayHistdetail.do', params)
        .then(function (response) {
          // vm.empHisdetail = response.data.empHisdetail;
          console.log('=======================================');
          vm.detail_hnm = response.data.empHisdetail.myNm;

          vm.detail_hdept = response.data.empHisdetail.myDept;

          vm.detail_hrank = response.data.empHisdetail.myRank;

          vm.detail_ypay = response.data.empHisdetail.myYpay;

          vm.detail_mpay = response.data.empHisdetail.myMpay;

          vm.detail_nins = response.data.empHisdetail.myNins;

          vm.detail_hins = response.data.empHisdetail.myHins;

          vm.detail_iins = response.data.empHisdetail.myIins;

          vm.detail_eins = response.data.empHisdetail.myEins;

          vm.detail_tax = response.data.empHisdetail.myTax;

          vm.detail_extra = response.data.empHisdetail.myExtra;

          vm.detail_rpay = response.data.empHisdetail.myRpay;
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    close: function () {
      closeModal();
    },
  },
};
</script>
