<template>
  <canvas id="yyRevenueChart" width="500" height="200"></canvas>
</template>
<script>
import Chart from 'chart.js/auto';
export default {
  props: { srcdate: String },
  data() {
    return {
      chartSrcdate: '',
      chartGrouplist: [],
      chartResult1: [],
    };
  },

  mounted() {
    this.chart();
  },
  methods: {
    chart: function () {
      this.chartSrcdate = this.srcdate;
      let params = new URLSearchParams();
      params.append('srcdate', this.chartSrcdate);

      this.$vuecombiListAxios('/sales/vueYearRevenue.do', params)
        .then((response) => {
          //차트 아래부분에 나올 년도
          let years = [];
          this.chartGrouplist = response.data.YYRevenueList;
          this.chartResult1 = response.data.result1;

          //년도 라벨
          for (let i in this.chartGrouplist) {
            years.push(this.chartGrouplist[i].srcday);
          }
          //차트범례
          let label = [];
          for (let i = 1; i < this.chartResult1[0].length; i++) {
            label.push(this.chartResult1[0][i]);
          }

          //범례별 데이터
          let chartData1 = [];
          let chartData2 = [];
          let chartData3 = [];
          let chartData4 = [];
          let chartData5 = [];

          //datasets : 당기순이익, 영업이익, 매출, 인건비, 기타지출
          for (let i = 1; i < this.chartResult1.length; i++) {
            chartData1.push(this.chartResult1[i][1]);
          }
          for (let i = 1; i < this.chartResult1.length; i++) {
            chartData2.push(this.chartResult1[i][2]);
          }
          for (let i = 1; i < this.chartResult1.length; i++) {
            chartData3.push(this.chartResult1[i][3]);
          }
          for (let i = 1; i < this.chartResult1.length; i++) {
            chartData4.push(this.chartResult1[i][4]);
          }
          for (let i = 1; i < this.chartResult1.length; i++) {
            chartData5.push(this.chartResult1[i][5]);
          }

          this.makeChart2(
            years,
            label,
            chartData1,
            chartData2,
            chartData3,
            chartData4,
            chartData5
          );
        })
        .catch((err) => {
          alert(err);
        });
    },
    makeChart2: function (
      years,
      label,
      chartData1,
      chartData2,
      chartData3,
      chartData4,
      chartData5
    ) {
      let delayed;
      const ctx = document.getElementById('yyRevenueChart').getContext('2d');
      const yyRevenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            {
              label: label[0],
              data: chartData1,
              backgroundColor: ['rgba(255, 99, 132, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
            {
              label: label[1],
              data: chartData2,
              backgroundColor: ['rgba(0, 99, 132, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
            {
              label: label[2],
              data: chartData3,
              backgroundColor: ['rgba(255, 255, 255, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
            {
              label: label[3],
              data: chartData4,
              backgroundColor: ['rgba(99, 99, 0, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
            {
              label: label[4],
              data: chartData5,
              backgroundColor: ['rgba(0, 0, 0, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1,
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
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });
      yyRevenueChart;
    },
  },
};
</script>
