<template>
  <!-- 년도별 손익통계 차트 -->

  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">매출 </span>
    <span class="btn_nav bold">년도매출현황 </span>
    <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
  </p>
  <p class="conTitle"><span>년도매출현황</span> <span class="fr"> </span></p>
  <p style="text-align: right">
    기간&nbsp;
    <input type="date" v-model="srcdate" />
    <a class="btnType blue" href="" @click.prevent="chartSearch"
      ><span>조회</span></a
    >
  </p>

  <!-- chart.js 컴포넌트-->
  <yyRevenueChart :srcdate="srcdate" :key="key"></yyRevenueChart>
  <!--  -->
  <div class="yearSearchList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="19%" />
        <col width="27%" />
        <col width="27%" />
        <col width="27%" />
      </colgroup>
      <thead>
        <tr v-html="html_head"></tr>
      </thead>

      <tbody>
        <tr v-html="html_body1"></tr>
        <tr v-html="html_body2"></tr>
        <tr v-html="html_body3"></tr>
        <tr v-html="html_body4"></tr>
        <tr v-html="html_body5"></tr>
        <tr v-html="html_body6"></tr>
        <tr v-html="html_body7"></tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import yyRevenueChart from './yyRevenueChart.vue';
export default {
  components: { yyRevenueChart: yyRevenueChart },
  data() {
    return {
      srcdate: '',
      grouplist: [],

      html_head: '',
      html_body1: '',
      html_body2: '',
      html_body3: '',
      html_body4: '',
      html_body5: '',
      html_body6: '',
      html_body7: '',

      key: 0,
    };
  },
  created() {
    //초기 년매출값
    this.getToday();
  },
  mounted() {
    this.yearRevenue();
  },

  methods: {
    getToday: function () {
      var date = new Date();
      var year = date.getFullYear();
      var month = ('0' + (1 + date.getMonth())).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);

      return year + '-' + month + '-' + day;
    },

    chartSearch() {
      //key 값이 변하면 yearRevenue 실행
      this.key += 1;
      this.yearRevenue();
    },
    yearRevenue: function () {
      let params = new URLSearchParams();

      params.append('srcdate', this.srcdate);
      this.$vuecombiListAxios('/sales/vueYearRevenue.do', params)
        .then((res) => {
          this.html_head = '<th scope="col"></th>';
          this.html_body1 = '<td>당기순이익</td>';
          this.html_body2 = '<td>영업이익</td>';
          this.html_body3 = '<td>매출</td>';
          this.html_body4 = '<td>인건비</td>';
          this.html_body5 = '<td>기타지출</td>';
          this.html_body6 = '<td>전년대비매출성장률</td>';
          this.html_body7 = '<td>전년대비순이익성장률</td>';

          for (var i in res.data.YYRevenueList) {
            this.html_head +=
              '\n' +
              '<th scope=' +
              '"col"' +
              '>' +
              res.data.YYRevenueList[i].srcday +
              '</th>';

            this.html_body1 +=
              '\n' +
              '<td>' +
              res.data.YYRevenueList[i].income.toLocaleString() +
              '</td>';
            this.html_body2 +=
              '\n' +
              '<td>' +
              res.data.YYRevenueList[i].take_pay.toLocaleString() +
              '</td>';
            this.html_body3 +=
              '\n' +
              '<td>' +
              res.data.YYRevenueList[i].order_pay.toLocaleString() +
              '</td>';
            this.html_body4 +=
              '\n' +
              '<td>' +
              res.data.YYRevenueList[i].salary_pay.toLocaleString() +
              '</td>';
            this.html_body5 +=
              '\n' +
              '<td>' +
              res.data.YYRevenueList[i].expense_pay.toLocaleString() +
              '</td>';

            if (res.data.YYRevenueList[i].take_pay_growth < 0) {
              this.html_body6 +=
                '\n' +
                '<td style="color: blue">' +
                res.data.YYRevenueList[i].take_pay_growth +
                '%' +
                '</td>';
            } else if (res.data.YYRevenueList[i].take_pay_growth > 0) {
              this.html_body6 +=
                '\n' +
                '<td style="color: red">' +
                res.data.YYRevenueList[i].take_pay_growth +
                '%' +
                '</td>';
            } else {
              this.html_body6 +=
                '\n' +
                '<td>' +
                res.data.YYRevenueList[i].take_pay_growth +
                '%' +
                '</td>';
            }

            if (res.data.YYRevenueList[i].income__growth < 0) {
              this.html_body7 +=
                '\n' +
                '<td style="color: blue">' +
                res.data.YYRevenueList[i].income__growth +
                '%' +
                '</td>';
            } else if (res.data.YYRevenueList[i].income__growth > 0) {
              this.html_body7 +=
                '\n' +
                '<td style="color: red">' +
                res.data.YYRevenueList[i].income__growth +
                '%' +
                '</td>';
            } else {
              this.html_body7 +=
                '\n' +
                '<td>' +
                res.data.YYRevenueList[i].income__growth +
                '%' +
                '</td>';
            }
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
