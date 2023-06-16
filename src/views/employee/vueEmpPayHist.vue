<template>
  <div>
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">인사 · 급여 </span>
      <span class="btn_nav bold">급여조회 </span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <div class="HisEmpList" id="HisEmpList">
      <p class="conTitle">
        <span>개인 급여 지급 내역 조회</span>
        <span class="fr" style="float: left; margin-bottom: 5px">
          사번
          <input
            type="text"
            width="100px;"
            id="meno"
            name="meno"
            v-model="myEno"
            style="text-align: center; font-weight: bold"
            readonly
          />
          &nbsp;사원명
          <input
            type="text"
            width="100px;"
            id="mnm"
            name="mnm"
            v-model="myNm"
            style="text-align: center; font-weight: bold"
            readonly
          />
          &nbsp;부서명
          <input
            type="text"
            width="100px;"
            id="mdept"
            name="mdept"
            v-model="myDept"
            style="text-align: center; font-weight: bold"
            readonly
          />
          &nbsp;현재직급
          <input
            type="text"
            width="100px;"
            id="mrank"
            name="mrank"
            v-model="myRank"
            style="text-align: center; font-weight: bold"
            readonly
          />
        </span>
      </p>

      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />

          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">지급일</th>
            <th scope="col">연봉</th>
            <th scope="col">기본급</th>
            <th scope="col">국민연금</th>
            <th scope="col">건강보험</th>

            <th scope="col">산재보험</th>
            <th scope="col">고용보험</th>
            <th scope="col">소득세</th>
            <th scope="col">비고금액</th>
            <th scope="col">실급여</th>
          </tr>
        </thead>
        <template v-if="cntempHislist == 0">
          <tbody>
            <tr>
              <td colspan="10">데이터가 존재하지 않습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody id="HisEmp" v-for="item in grouplist" :key="item.myDate">
            <tr>
              <td>
                <a href="" @click.prevent="detailModal(item.myDate)">
                  {{ item.myDate }}
                </a>
              </td>
              <td>{{ item.myYpay }}</td>
              <td>{{ item.myMpay }}</td>
              <td>{{ item.myNins }}</td>
              <td>{{ item.myHins }}</td>
              <td>{{ item.myIins }}</td>
              <td>{{ item.myEins }}</td>
              <td>{{ item.myTax }}</td>
              <td>{{ item.myExtra }}</td>
              <td>{{ item.myRpay }} 원</td>
            </tr>
          </tbody>
        </template>
      </table>

      <paginate
        class="justify-content-center"
        v-model="cpage"
        :page-count="totalPage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="myemp"
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
// axios를 전역함수로 지정했기 때문에 import 안해도 됨
//import { vuecombiListAxios } from '../employee';
import paginate from 'vuejs-paginate-next';
import { openModal } from 'jenesius-vue-modal';
import vueEmpPayHistModal from './vueEmpPayHistModal';

export default {
  data() {
    return {
      myEno: '',
      myNm: '',
      myDept: '',
      myRank: '',

      cntempHislist: '',
      grouplist: [],

      cpage: 1,
      pageSize: 5,
      pageBlockSize: 5,
      totalPage: 1,
      empHisdetail: {},
    };
  },
  mounted() {
    this.myemp();
  },
  methods: {
    myemp: function (cpage) {
      let vm = this;
      this.cpage = cpage || 1; // 현재 page가 undefined 면 1로 셋팅
      // param과 callback 지정

      let params = new URLSearchParams();
      params.append('pageSize', this.pageSize);
      params.append('cpage', this.cpage);

      // axios 호출 시 this.$vuecombiListAxios(url, params) 하면 됨
      this.$vuecombiListAxios('/employee/vueEmpPayHistlist.do', params)
        .then(function (response) {
          vm.grouplist = response.data.empHislist;
          vm.cntempHislist = response.data.cntempHislist;

          vm.myEno = response.data.empHislist[0].myEno;
          vm.myNm = response.data.empHislist[0].myNm;
          vm.myDept = response.data.empHislist[0].myDept;
          vm.myRank = response.data.empHislist[0].myRank;
          // 전역 함수로 선언한 $page 사용법 -> 인자로 리스트카운트, 페이지사이즈를 보낸다
          // 어떤 함수인지 알고 싶으면 ./commonGlobal/global.js 참고
          vm.totalPage = vm.$page(vm.cntempHislist, vm.pageSize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    //상단 리스트에서 상세보기 버튼을 눌렀을 때
    detailModal: async function (myDate) {
      console.log('급여지급일 ' + myDate);
      //상세보기 모달창 띄우기
      const modal = await openModal(vueEmpPayHistModal, {
        myPayDate: myDate,
      });
      //팝업창 닫힐 때
      modal.onclose = () => {
        this.myemp();
      };
    },
  },
  components: {
    paginate: paginate,
  },
};
</script>
