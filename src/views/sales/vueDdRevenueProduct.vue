<template>
  <canvas id="vueDdRevenueProduct" height="200"></canvas>
</template>

<script>
import Chart from 'chart.js/auto';
// import { vuecombiListAxios } from '../system';

export default {
  props: { date: String, clientno: String },
  //   watch: {
  //     searchDate() {
  //       this.search = this.searchDate;
  //       this.fnDdRevChart();
  //     },
  //   },
  mounted() {
    this.productChart();
  },
  data: function () {
    return {
      //초기화면 리스트
      chartDiv: [],

      cSearchDate: '',
      cMonthAgo: '',
      cClientno: '',

      productArr: '',
      pSalesArr: 0,
    };
  },
  computed: {},
  components: {},

  methods: {
    productChart: function () {
      let vm = this;
      let params = new URLSearchParams();

      this.cSearchDate = this.date;
      this.cClientno = this.clientno;
      console.log('====================차트');

      params.append('searchDate', this.cSearchDate);
      params.append('searchClientNo', this.cClientno);

      this.$vuecombiListAxios('/sales/vueDdRevProductChart.do', params).then(
        function (response) {
          //console.log('searchemp response' + JSON.stringify(response));

          vm.chartDiv = response.data.ddRevProductChartModel;

          console.log('vm.chartDiv ' + JSON.stringify(vm.chartDiv));
          console.log(
            'vresponse.data.ddRevChartModel ' +
              JSON.stringify(response.data.ddRevProductChartModel)
          );

          const productArr = [];
          const pSalesArr = [];

          for (let i in vm.chartDiv) {
            productArr.push(vm.chartDiv[i].product_name);
            pSalesArr.push(vm.chartDiv[i].sum_p_sales);
          }
          vm.makeChart(productArr, pSalesArr);
        }
      );
    },
    makeChart: function (productArr, pSalesArr) {
      let delayed;
      const ctx = document
        .getElementById('vueDdRevenueProduct')
        .getContext('2d');
      const vueDdRevenueProduct = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: productArr,
          datasets: [
            {
              label: '제품 이름',
              data: productArr,
              backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
              ],
              borderColor: ['rgb(75, 192, 192)'],
              borderWidth: 1,
              // this dataset is drawn below
              order: 1,
            },
            {
              label: '합계금액',
              data: pSalesArr,
              borderColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
              ],
              backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
              ],

              type: 'doughnut',
              // this dataset is drawn on top
              order: 2,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (
                context.type === 'data' &&
                context.mode === 'default' &&
                !delayed
              ) {
                delay = context.dataIndex * 250 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
        },
      });
      vueDdRevenueProduct;
    },
  },
};
</script>
