<template>
  <!-- 최상단 집/매출/월별매출현황 -->
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">매출</span>
    <span class="btn_nav bold">월별매출현황</span>
    <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
  </p>

  <!-- 월별매출현황 제목 -->
  <p class="conTitle"><span>월별매출현황</span> <span class="fr"> </span></p>

  <!-- 검색창 -->
  <span> 기 간 </span>
  <select id="year" name="year" style="width: 150px" v-model="selectyear">
    <option
      :selected="selectyear"
      v-for="(year, index) in options"
      :key="index"
      :value="year"
    >
      {{ year }}
    </option>
  </select>

  <!-- 날짜선택 -->
  <input type="text" style="width: 150px; height: 25px" value="1월" readonly />
  ~
  <input type="text" style="width: 150px; height: 25px" value="12월" readonly />
  <a
    href=""
    @click.prevent="chart"
    class="btnType blue"
    id="btnSearch"
    name="btn"
  >
    <span>검색</span></a
  >
  <!-- 검색창 끝 -->
  <!-- 월별 매출통계 차트영역 -->
  <div style="width: 100%">
    <vueMmRevenueChart :year="selectyear" :key="key"></vueMmRevenueChart>
  </div>

  <!-- 월별매출조회 테이블 -->
  <br /><br />
  <div class="divmmRevList">
    <table id="mmRevtable_main" class="col">
      <template v-if="mmRevenuelist1 == '' && mmRevenuelist2 == ''">
        <colgroup>
          <col width="10%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
        </colgroup>

        <thead>
          <tr>
            <th colspan="7" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="7">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>

      <template v-if="mmRevenuelist1 != ''">
        <colgroup>
          <col width="10%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" v-for="(list, item) in mmRevenuelist1" :key="item">
              {{ list.ym_date }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">주문건수</th>
            <td v-for="(list, item) in mmRevenuelist1" :key="item">
              {{ list.order_amt }}(건)
            </td>
          </tr>
          <tr>
            <th scope="row">매출</th>
            <td v-for="(list, item) in mmRevenuelist1" :key="item">
              {{ $comma(list.outgo) }}
            </td>
          </tr>
          <tr>
            <th scope="row">영업비</th>
            <td v-for="(list, item) in mmRevenuelist1" :key="item">
              {{ list.sales_exp }}
            </td>
          </tr>
          <tr>
            <th scope="row">영업이익</th>
            <td v-for="(list, item) in mmRevenuelist1" :key="item">
              {{ list.sales_profit }}
            </td>
          </tr>
          <tr>
            <th scope="row">영업이익률</th>
            <td v-for="(list, item) in mmRevenuelist1" :key="item">
              {{ list.profit_rate }}
            </td>
          </tr>
        </tbody>
      </template>

      <template v-if="mmRevenuelist2 != ''">
        <colgroup>
          <col width="10%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" v-for="(list, item) in mmRevenuelist2" :key="item">
              {{ list.ym_date }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td scope="row">주문건수</td>
            <td v-for="(list, item) in mmRevenuelist2" :key="item">
              {{ list.order_amt }}(건)
            </td>
          </tr>
          <tr>
            <td scope="row">매출</td>
            <td v-for="(list, item) in mmRevenuelist2" :key="item">
              {{ list.outgo }}
            </td>
          </tr>
          <tr>
            <td scope="row">영업비</td>
            <td v-for="(list, item) in mmRevenuelist2" :key="item">
              {{ list.sales_exp }}
            </td>
          </tr>
          <tr>
            <td scope="row">영업이익</td>
            <td v-for="(list, item) in mmRevenuelist2" :key="item">
              {{ list.sales_profit }}
            </td>
          </tr>
          <tr>
            <td scope="row">영업이익률</td>
            <td v-for="(list, item) in mmRevenuelist2" :key="item">
              {{ list.profit_rate }}
            </td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
</template>

<script>
import vueMmRevenueChart from './vueMmRevenueChart.vue';

export default {
  components: { vueMmRevenueChart: vueMmRevenueChart },
  data() {
    return {
      selectyear: '',
      mmRevenuelist1: [],
      mmRevenuelist2: [],
      mmRevenuelist: [],
      dateArr: [],
      salesArr: [],
      sproArr: [],
      sproRateArr: [],
      grouplist: [],
      grouplist1: [],
      options: [],
      option: '',
      year: '',
      key: '',
    };
  },
  created() {
    this.setDateBox();
  },
  mounted() {
    this.board_search();
  },

  methods: {
    board_search: function () {
      let params = new URLSearchParams();
      params.append('selectyear', this.selectyear);

      this.axios.post('/sales/mmRevenuelistvue.do', params).then((response) => {
        console.log(JSON.stringify(response));
        this.mmRevenuelist1 = response.data.mmRevenuelist1;
      });
    },
    chart() {
      this.key += 1;
      this.board_search();
    },

    setDateBox() {
      let dt = new Date();
      this.selectyear = dt.getFullYear();
      for (let y = this.selectyear; y >= this.selectyear - 10; y--) {
        this.options.push(y);
        console.log(this.selectyear);
      }
    },
  },
};
</script>
