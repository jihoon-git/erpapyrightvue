<template>
  <canvas id="vueDdRevenueDet" height="200"></canvas>
</template>
<script>
import Chart from 'chart.js/auto';
// import { vuecombiListAxios } from '../system';

export default {
  props: { date: String, MonthAgo: String, clientno: String },
  //   watch: {
  //     searchDate() {
  //       this.search = this.searchDate;
  //       this.fnDdRevChart();
  //     },
  //   },
  mounted() {
    this.fnDdRevChart();
  },
  data: function () {
    return {
      //초기화면 리스트
      chartDiv: [],

      cSearchDate: '',
      cMonthAgo: '',
      cClientno: '',

      dateArr: '',
      salesArr: 0,
      cumsalesArr: 0,
      keys: '',
    };
  },
  computed: {},
  components: {},

  methods: {
    fnDdRevChart: function () {
      let vm = this;
      let params = new URLSearchParams();

      this.cSearchDate = this.date;
      this.cMonthAgo = this.MonthAgo;
      this.cClientno = this.clientno;

      console.log('====================매출차트');

      params.append('searchDate', this.cSearchDate);
      params.append('oneMonthAgo', this.cMonthAgo);
      params.append('searchClientNo', this.cClientno);

      this.$vuecombiListAxios('/sales/vueDdRevChart.do', params).then(function (
        response
      ) {
        //console.log('searchemp response' + JSON.stringify(response));

        vm.chartDiv = response.data.ddRevChartModel;

        // console.log('vm.chartDiv ' + JSON.stringify(vm.chartDiv));
        // console.log(
        //   'vresponse.data.ddRevChartModel ' +
        //     JSON.stringify(response.data.ddRevChartModel)
        // );

        const dateArr = [];
        const salesArr = [];
        const cumsalesArr = [];
        for (let i in vm.chartDiv) {
          dateArr.push(vm.chartDiv[i].contract_date);
          salesArr.push(vm.chartDiv[i].sum_sales);
          cumsalesArr.push(vm.chartDiv[i].cumsum_sales);
        }
        vm.makeChart(dateArr, salesArr, cumsalesArr);
      });
    },
    makeChart: function (dateArr, salesArr, cumsalesArr) {
      let delayed;
      const ctx = document.getElementById('vueDdRevenueDet').getContext('2d');
      const vueDdRevenueDet = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dateArr,
          datasets: [
            {
              label: '매출 (원)',
              data: salesArr,
              backgroundColor: [
                'rgba(130, 170, 227,0.6)',
                'rgba(110, 170, 220, 0.6)',
                'rgba(90, 170, 210, 0.6)',
                'rgba(70, 170, 200, 0.6)',
                'rgba(50, 170, 190, 0.6)',
                'rgba(50, 170, 180, 0.6)',
                'rgba(50, 170, 170, 0.6)',
                'rgba(50, 170, 160, 0.6)',
                'rgba(58, 166, 185, 0.6)',
                'rgba(255, 139, 82, 0.6)',
                'rgba(255, 149, 72, 0.6)',
              ],
              borderColor: [
                'rgba(130, 170, 227,1)',
                'rgba(130, 170, 227,1)',
                'rgba(130, 170, 227,1)',
                'rgba(130, 170, 227,1)',
                'rgba(130, 170, 227,1)',
                'rgba(130, 170, 227,1)',
                'rgba(130, 170, 227,1)',
                'rgba(130, 170, 227,1)',
                'rgba(130, 170, 227,1)',
              ],
              borderWidth: 1,
              // this dataset is drawn below
              order: 1,
            },
            {
              label: '누적',
              data: cumsalesArr,
              borderColor: 'rgba(255, 99, 132, 0.7)',
              type: 'line',
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
      vueDdRevenueDet;
    },
  },
};
</script>
