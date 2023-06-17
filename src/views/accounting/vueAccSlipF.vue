<template>
  <div>
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">회계</span>
      <span class="btn_nav bold">회계전표 조회</span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle">
      <span>회계전표 조회</span>
      <span class="fr" style="margin-top: 5px">
        <input
          type="date"
          id="srcsdate"
          name="srcsdate"
          style="width: 145px"
          v-model="srcsdate"
        />~
        <input
          type="date"
          id="srcedate"
          name="srcedate"
          style="width: 145px"
          v-model="srcedate"
        />
        <br />
        거래처명
        <clientSelectBox
          client_no="client_no"
          selectid="client_no"
          type="all"
          selvalue=""
          eventid="vueBizPartner"
          v-model="client_no"
          @change="bclick"
          ref="Com_combo"
          @send-message="sendmessage"
          style="margin-right: 3px"
        ></clientSelectBox>

        계정과목
        <detileAccount
          laccount_cd="0"
          selectid="account_name"
          type="all"
          selvalue=""
          eventid="ComboEvent"
          v-model="account_name"
          @change="bclick"
          ref="Com_combo"
          @send-message="sendmessage"
          style="margin-right: 3px"
        ></detileAccount>
        <a
          class="btnType blue"
          href=""
          name="modal"
          @click.prevent="searchClick()"
          ><span>조회</span></a
        >
      </span>
    </p>
    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="5%" />
          <col width="8%" />
          <col width="12%" />
          <col width="10%" />
          <col width="7%" />
          <col width="10%" />
          <col width="8%" />
          <col width="30%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">전표번호</th>
            <th scope="col">수주/지출일자</th>
            <th scope="col">수주/지출번호</th>
            <th scope="col">계정코드</th>
            <th scope="col">계정과목</th>
            <th scope="col">담당자</th>
            <th scope="col">거래처명</th>
            <th scope="col">수입/지출</th>
          </tr>
        </thead>
        <template v-if="totalCnt == 0">
          <tbody id="accSlipFList">
            <tr>
              <td colspan="9">데이터가 존재하지 않습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody
            id="accSlipFList"
            v-for="item in accSlipFGrp"
            :key="item.account_no"
          >
            <!-- 수주 -->
            <template
              v-if="
                item.account_no != 0 &&
                item.order_cd != null &&
                item.exp_no == 0
              "
            >
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.account_no }}</td>
                <td>{{ item.contContract_date }}</td>
                <td>
                  <a
                    href=""
                    @click.prevent="vuefn_contractDetaile(item.order_cd)"
                    >{{ item.order_cd }}</a
                  >
                </td>
                <td>{{ item.contAccount_cd }}</td>
                <td>{{ item.contAccount_name }}</td>
                <td>{{ item.contUserName }}</td>
                <td>{{ item.contClient_name }}</td>
                <td style="color: blue; font-weight: bold">
                  {{ $comma(item.contTotal_price) }}원
                </td>
              </tr>
            </template>
            <template
              v-if="
                item.account_no != 0 &&
                item.order_cd == null &&
                item.exp_no != 0
              "
            >
              <!-- 지출 -->
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.account_no }}</td>
                <td>{{ item.expYn_date }}</td>
                <td>
                  <a href="" @click.prevent="vuefn_expDetaile(item.exp_no)">{{
                    item.exp_no
                  }}</a>
                </td>
                <td>{{ item.exptAccount_cd }}</td>
                <td>{{ item.exptaccount_name }}</td>
                <td>{{ item.exptUserName }}</td>
                <td>-</td>
                <td style="color: red; font-weight: bold">
                  -{{ $comma(item.expt_spent) }}원
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </table>
    </div>

    <Paginate
      class="justify-content-center"
      v-model="cpage"
      :page-count="totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="accSlipFListSearch"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </Paginate>

    <br />
    <br />
  </div>
</template>
<script>
import clientSelectBox from '@/components/common/clientSelectBox.vue';
import detileAccount from '@/components/common/detileAccount.vue';
import Paginate from 'vuejs-paginate-next';

export default {
  data: function () {
    return {
      client_no: '',
      clientName: '',
      laccount_cd: 0,
      account_cd: '',
      account_name: '',
      srcsdate: '',
      srcedate: '',
      searchKey: '',
      searchVal: '',

      totalCnt: '',
      accSlipFGrp: [],

      cpage: 1,
      pageSize: 5,
      pageBlockSize: 5,
      totalPage: 1,
    };
  },
  components: {
    clientSelectBox,
    detileAccount,
    // eslint-disable-next-line vue/no-unused-components
    Paginate,
  },
  created() {},
  unmounted() {
    this.emitter.off('vueBizPartner');
    this.emitter.off('ComboEvent');
  },
  mounted() {
    this.accSlipFListSearch();
  },
  methods: {
    bclick: function () {
      this.emitter.emit('vueBizPartner', this.client_no);
      this.emitter.emit('ComboEvent', this.account_name);

      //alert(this.client_no);
    },
    sendmessage: function () {
      // alert('sendmessage');
    },
    searchClick: function () {
      this.searchKey = '';

      // 조회 버튼 클릭 시 실행되는 메소드
      // 공통함수 checkStartEndDate를 실행하여 검색 종료일이 검색 시작일보다 빠를 시 return
      const checkDate = this.$checkStartEndDate(this.srcsdate, this.srcedate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.srcedate = '';
        return false;
      }
      this.searchKey = 'Z';
      this.accSlipFListSearch();
    },
    accSlipFListSearch: function (cpage) {
      let vm = this;
      this.cpage = cpage || 1; // 현재 page가 undefined 면 1로 셋팅

      // param과 callback 지정
      let params = new URLSearchParams();
      params.append('pageSize', this.pageSize);
      params.append('cpage', this.cpage);

      // 검색버튼을 눌러서 리스트를 출력하는 경우
      // 파라미터 값으로 검색 조건들을 함께 담아서 보냄
      if (this.searchKey == 'Z') {
        params.append('client_no', this.client_no);
        params.append('account_cd', this.account_name);
        params.append('srcsdate', this.srcsdate);
        params.append('srcedate', this.srcedate);
      }

      this.$vuecombiListAxios('/accounting/vueAccSlipFList.do', params)
        .then(function (response) {
          vm.accSlipFGrp = response.data.accSlipFList;
          vm.totalCnt = response.data.totalCnt;

          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
  },
};
</script>
