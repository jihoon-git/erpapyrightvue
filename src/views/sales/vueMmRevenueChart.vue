<template>
  <canvas id="vueMmRevenueChart" width="500" height="200"></canvas>
</template>
<script>
import Chart from 'chart.js/auto';
export default {
  props: { year: String },
  data() {
    return {
      mmRevenuelist: [],
      chartYear: '',
      ym_date: '',
      outgo: 0,
      sales_profit: 0,
      profit_rate: 0,
      cyear: '',
      chartList: [],
      mmRevenuelist1: [],
    };
  },
  methods: {
    chart: function () {
      this.chartYear = this.year;
      console.log('year' + this.year);

      let param = new URLSearchParams();

      //param.append('ym_date.substr(0,4)', this.chartYear);
      param.append('selectyear', this.chartYear);

      console.log('cyear' + this.chartYear);

      this.axios.post('/sales/viewmmChartvue.do', param).then((Response) => {
        console.log(JSON.stringify(Response));
        this.chartList = Response.data.mmRevenuelist;

        const dateArr = [];
        const salesArr = [];
        const sproArr = [];
        const sproRateArr = [];
        for (let i in this.chartList) {
          dateArr.push(this.chartList[i].ym_date);
          salesArr.push(this.chartList[i].outgo);
          sproArr.push(this.chartList[i].sales_profit);
          sproRateArr.push(this.chartList[i].profit_rate);
        }
        this.makeChart(dateArr, salesArr, sproArr, sproRateArr);
      });
    },
    makeChart: function (dateArr, salesArr, sproArr, sproRateArr) {
      let delayed;
      const ctx = document.getElementById('vueMmRevenueChart').getContext('2d');
      const vueMmRevenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dateArr,
          datasets: [
            {
              label: '매출',
              data: salesArr,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 119, 112, 0.6)',
              ],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
              // this dataset is drawn below
              order: 2,
            },
            {
              label: '영업이익',
              data: sproArr,
              borderColor: 'rgba(255, 99, 132, 0.7)',
              type: 'line',
              // this dataset is drawn on top
              order: 1,
            },
            {
              label: '영업이익률',
              data: sproRateArr,
              borderColor: 'rgba(255, 99, 132, 0.7)',
              type: 'line',
              // this dataset is drawn on top
              order: 1,
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
                delay = context.dataIndex * 400 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
        },
      });
      vueMmRevenueChart;
    },
  },
  mounted() {
    this.chart();
  },
};
</script>
