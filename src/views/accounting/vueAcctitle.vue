<template>
  <div>
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">회계</span>
      <span class="btn_nav bold">계정과목 관리</span>
      <a href="../accounting/vueAcctitle" class="btn_set refresh">새로고침</a>
    </p>
    <p class="conTitle">
      <span>계정과목 관리</span>
      <span class="fr">
        <span>계정대분류</span
        ><ComCombo
          group_code="laccount_cd"
          selectid="laccount_cd"
          type="all"
          selvalue=""
          eventid="ComboEvent"
          v-model="laccount_cd"
          @change="bclick"
          ref="Com_combo"
          style="margin-right: 3px"
        ></ComCombo>
        <span>계정세부명</span
        ><detileAccount
          :laccount_cd="laccount_cd"
          selectid="account_cd"
          type="all"
          selvalue=""
          eventid="detailCombo"
          v-model="account_cd"
          @change="ComboChange"
          ref="Com_combo"
          :key="keys"
          style="margin-right: 3px"
        ></detileAccount>
        <span>구분</span
        ><select
          name="accounttype"
          id="accounttype"
          style="width: 100px"
          v-model="accounttype"
        >
          <option value="">전체</option>
          <option value="X">수입</option>
          <option value="O">지출</option>
        </select>

        <a class="btnType blue" href="" @click.prevent="btnSearch()"
          ><span>검색</span>
        </a>
        <a class="btnType blue" href="" @click.prevent="registerAccCodeBtn()"
          ><span>신규등록</span></a
        >
      </span>
    </p>

    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="15%" />
          <col width="20%" />
          <col width="15%" />
          <col width="40%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">계정대분류코드</th>
            <th scope="col">계정대분류명</th>
            <th scope="col">계정과목코드</th>
            <th scope="col">계정과목명</th>
            <th scope="col">입출구분</th>
          </tr>
        </thead>
        <template v-if="totalCnt == 0">
          <tbody>
            <tr>
              <td colspan="5">데이터가 존재하지 않습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="(list, index) in accTitlelist" :key="index">
            <tr @click="accTitleDetail(list.account_cd)">
              <td>{{ list.laccount_cd }}</td>
              <td>{{ list.detail_name }}</td>
              <td>{{ list.account_cd }}</td>
              <td>{{ list.account_name }}</td>
              <td v-if="list.account_type === 'O'">지출</td>
              <td v-if="list.account_type === 'X'">수입</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <div>
      <paginate
        class="justify-content-center"
        v-model="currentPage"
        :page-count="totalPage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="clickCallback"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
  </div>
</template>
<script>
import Paginate from 'vuejs-paginate-next';
import { openModal } from 'jenesius-vue-modal';
import vueAcctitleModal from './vueAcctitleModal.vue';
import ComCombo from '@/components/common/ComCombo.vue';
import detileAccount from '@/components/common/detileAccount.vue';
// import { vuecombiListAxios } from '../system';

export default {
  mounted() {
    this.searchAcctitle();
  },
  data: function () {
    return {
      //초기화면 리스트
      accTitlelist: [],

      //pageinate 설정
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0,
      grdNo: 1,

      //부서 검색
      src: '',
      accounttype: '',
      srclaccount_cd: '',
      srcaccount_cd: '',
      srcaccounttype: '',

      //comcombo
      group_code: 0,

      client_no: 0,
      clientName: '',
      laccount_cd: '',
      laccountName: '',
      testVal: 0,
      account_cd: '',

      keys: 0,
    };
  },
  computed: {},
  components: {
    ComCombo,
    detileAccount,
    paginate: Paginate,
  },
  unmounted() {
    this.emitter.off('ComboEvent');
    this.emitter.off('detailCombo');
  },

  methods: {
    btnSearch: function () {
      this.src = 'S';
      this.searchAcctitle();
    },
    //화면초기
    searchAcctitle: function () {
      let vm = this;

      let params = new URLSearchParams();
      if (this.src == 'S') {
        params.append('cpage', this.currentPage);
        params.append('pageSize', this.pageSize);
        params.append('laccTitle', this.laccount_cd);
        params.append('accTitle', this.account_cd);
        params.append('accounttype', this.accounttype);

        console.log('this.laccount_cd ' + this.laccount_cd);
        console.log('this.account_cd ' + this.account_cd);
        console.log('this.accounttype ' + this.accounttype);
      } else {
        params.append('cpage', this.currentPage);
        params.append('pageSize', this.pageSize);
      }

      this.$vuecombiListAxios('/accounting/vueAcctitlelist.do', params).then(
        function (response) {
          //console.log('searchAcctitle response' + JSON.stringify(response));

          //paginate 설정
          vm.totalCnt = response.data.countAcctitlelist;
          vm.accTitlelist = response.data.accTitlelist;
          //page를 전역변수 사용
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
          //vm.totalPage = vm.page();

          vm.currentPage == 1
            ? (vm.grdNo = 1)
            : (vm.grdNo = 5 * (vm.currentPage - 1) + 1);

          for (let value of vm.accTitlelist) {
            value.indexNew = vm.grdNo++;
          }
        }
      );

      //console.log('this.laccount_cd ' + this.laccount_cd);
      //console.log('this.account_cd ' + this.account_cd);
    },

    //paginate callback
    clickCallback: function (pageNum) {
      console.log(pageNum);

      this.currentPage = pageNum;
      //this.Paginate.pageNum = 10;
      this.searchAcctitle();
    },

    registerAccCodeBtn: async function () {
      const modal = await openModal(vueAcctitleModal, {
        //vueAcctitleModal의 saveModal에 action값 넘김
        saveModalAction: 'I',
      }); //상세보기 클릭은 값을 넘겨야함.

      modal.onclose = () => {
        console.log('Close : ');
        this.searchAcctitle();
      };
    },
    // 부서관리 초기화면에서 요소(부서명)를 클릭하면 상세조회
    accTitleDetail: async function (account_cd) {
      const modal = await openModal(vueAcctitleModal, {
        //vueAcctitleModal의 saveModal에 detail_code 값, action 값 넘김)
        sendDetailCode: account_cd,
        saveModalAction: 'U',
      }); //상세보기 클릭은 값을 넘겨야함.

      modal.onclose = () => {
        console.log('Close : ');
        this.searchAcctitle();
      };
    },
    bclick: function () {
      this.emitter.emit('ComboEvent', this.laccount_cd);
      this.account_cd = '';
      this.accounttype = '';
      this.keys += 1;
    },
    ComboChange: function () {
      this.emitter.emit('detailCombo', this.account_cd);
      this.accounttype = '';
    },
  },
};
</script>
<style>
.black-bg {
  width: 100%;
  height: 100%;
  background: rgba(201, 204, 22, 0.5);
  position: fixed;
  padding: 20px;
}

.white-bg {
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 8px;
}
</style>
