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
    };
  },
  created() {
    this.chartSrcdate = this.srcdate;
    console.log(this.chartSrcdate);
  },

  watch: {
    chartSrcdate() {
      console.log('watch들어옴');
      this.chart();
    },
  },
  methods: {
    chart: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('srcdate', this.srcdate);
      this.$vuecombiListAxios('/sales/vueYearRevenue.do', params).then(
        function (response) {
          vm.chartGrouplist = response.data.result1;
          console.log('chart result ' + JSON.stringify(vm.chartGrouplist));

          let arrLabels = [];
          let years = [];
          let yySales = [];

          //년도 추출
          for (let i = 1; i < 4; i++) {
            years.push(this.chartGrouplist[i][0]);
          }
          for (let i = 1; i < 4; i++) {
            for (let j = 1; j < 6; j++) {
              yySales.push(this.chartGrouplist[i][j]);
            }
          }
          console.log('years' + JSON.stringify(years));
          const ctx = document
            .getElementById('yyRevenueChart')
            .getContext('2d');
          const Barchart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: years,
              datasets: [
                {
                  label: arrLabels,
                  data: yySales,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
          Barchart;
        }
      );
    },
  },
  makeChart2: function () {},
};
</script>
