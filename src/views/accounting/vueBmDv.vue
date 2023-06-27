<template>
  <div>
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">회계</span>
      <span class="btn_nav bold">지출결의서</span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>
    <p class="conTitle">
      <span>지출결의서</span>
      <span class="fr">
        <a
          class="btnType blue"
          href=""
          @click.prevent="fn_openpopup()"
          name="modal"
          style="float: right"
          ><span>신규등록</span></a
        >
      </span>
    </p>

    <div>
      <p>
        신청일자<input type="date" name="stdate" id="stdate" v-model="stdate" />
        ~ <input type="date" name="eddate" id="eddate" v-model="eddate" />
        <template v-if="bmUserType == 'B' || bmUserType == 'C'">
          사원명<input
            type="text"
            name="searchname"
            id="searchname"
            v-model="searchname"
          />
        </template>
        <a
          class="btnType blue"
          href=""
          @click.prevent="searchClick()"
          id="listsearch"
          name="btn"
          style="float: right"
          ><span>조회</span></a
        >
      </p>
      <br />
      <p>
        계정대분류명
        <ComCombo
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
        <!--         <select
          name="lctcd"
          id="lctcd"
          v-model="lctcd"
          @change="laccountchange()"
        ></select> -->
        상세분류명
        <detileAccount
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
        <!-- <select name="actcd" id="actcd" v-model="actcd"></select> -->
        승인여부
        <select name="expyn" id="expyn" v-model="expyn">
          <option value="">전체</option>
          <option value="Y">승인</option>
          <option value="W">승인대기</option>
          <option value="N">반려</option>
        </select>
      </p>
    </div>
    <br />

    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <template v-if="bmUserType == 'D'">
          <colgroup>
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="11%" />
            <col width="10%" />
            <col width="10%" />
            <col width="13%" />
            <col width="13%" />
            <col width="13%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">결의번호</th>
              <th scope="col">계정대분류명</th>
              <th scope="col">상세분류명</th>
              <th scope="col">신청일자</th>
              <th scope="col">사용일자</th>
              <th scope="col">지출금액</th>
              <th scope="col">승인여부</th>
              <th scope="col">승인/반려일자</th>
              <th scope="col">승인/반려자</th>
            </tr>
          </thead>
        </template>
        <template v-if="bmUserType == 'B' || bmUserType == 'C'">
          <colgroup>
            <col width="8%" />
            <col width="9%" />
            <col width="6%" />
            <col width="11%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="8%" />
            <col width="9%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">결의번호</th>
              <th scope="col">아이디</th>
              <th scope="col">사원명</th>
              <th scope="col">계정대분류명</th>
              <th scope="col">상세분류명</th>
              <th scope="col">신청일자</th>
              <th scope="col">사용일자</th>
              <th scope="col">지출금액</th>
              <th scope="col">승인여부</th>
              <th scope="col">승인/반려일자</th>
              <th scope="col">승인/반려자</th>
            </tr>
          </thead>
        </template>
        <template v-if="expenlistcnt == 0">
          <tbody>
            <tr>
              <td colspan="11">데이터가 존재하지 않습니다.</td>
            </tr>
          </tbody>
        </template>

        <template v-else>
          <tbody
            id="vueExpenselist"
            v-for="item in expenlist"
            :key="item.exp_no"
          >
            <tr>
              <td>
                <a
                  href=""
                  @click.prevent="
                    fn_detailexpense(
                      item.exp_no,
                      item.exp_yn,
                      item.loginID,
                      'U'
                    )
                  "
                  >{{ item.exp_no }}</a
                >
              </td>
              <template v-if="bmUserType == 'B' || bmUserType == 'C'">
                <td>{{ item.loginID }}</td>
                <td>{{ item.name }}</td>
              </template>
              <td>{{ item.detail_name }}</td>
              <td>{{ item.account_name }}</td>
              <td>{{ item.exp_date }}</td>
              <td>{{ item.use_date }}</td>
              <td>{{ item.exp_spent }}</td>
              <td v-if="item.exp_yn == 'Y'">승인</td>
              <td v-else-if="item.exp_yn == 'N'">반려</td>
              <td v-else>
                <template v-if="bmUserType == 'B' || bmUserType == 'C'">
                  <a
                    class="btnType blue"
                    href=""
                    @click.prevent="
                      fn_detailexpense(
                        item.exp_no,
                        item.exp_yn,
                        item.loginID,
                        'A'
                      )
                    "
                    ><span>대기</span></a
                  >
                </template>
                <template v-else> 대기 </template>
              </td>
              <td>{{ item.yn_date }}</td>
              <td>{{ item.exp_name }}</td>
            </tr>
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
      :click-handler="searchBmDv"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </Paginate>
  </div>
  <!--// content -->
</template>
<script>
import Paginate from 'vuejs-paginate-next';
import ComCombo from '@/components/common/ComCombo.vue';
import detileAccount from '@/components/common/detileAccount.vue';
import { openModal } from 'jenesius-vue-modal';
import vueBmDvModal from './vueBmDvModal.vue';
export default {
  data() {
    return {
      bmUserType: '',
      bmLoginId: '',
      bmLoginNm: '',

      cpage: 1,
      pageSize: 5,
      pageBlockSize: 5,
      totalPage: 1,

      expenlist: [],
      expenlistcnt: 0,
      bmDvPagination: '',

      stdate: '',
      eddate: '',
      expyn: '',
      searchname: '',
      searchKey: '',

      group_code: 0,

      client_no: 0,
      clientName: '',
      laccount_cd: '',
      laccountName: '',
      testVal: 0,
      account_cd: '',
      keys: 0,
      rExpNo: '',

      // 상세조회시 보내는 값들
      detExpyn: '',
      ynFlag: false,
      myExpFlag: false,
      rAction: '',
      rDisabledFlag: false,
    };
  },
  components: {
    Paginate,
    ComCombo,
    detileAccount,
  },
  created() {
    this.bmUserType = this.$store.state.loginInfo.userType;
    this.bmLoginId = this.$store.state.loginInfo.loginId;
    this.bmLoginNm = this.$store.state.loginInfo.userNm;
  },
  unmounted() {
    this.emitter.off('ComboEvent');
    this.emitter.off('detailCombo');
  },
  mounted() {
    this.searchBmDv();
  },
  methods: {
    searchClick: function () {
      this.searchKey = '';
      // 조회 버튼 클릭 시 실행되는 메소드
      // 공통함수 checkStartEndDate를 실행하여 검색 종료일이 검색 시작일보다 빠를 시 return
      const checkDate = this.$checkStartEndDate(this.stdate, this.eddate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.eddate = '';
        return false;
      }

      const checkName = this.$checkEmpName(this.searchname);
      if (!checkName) {
        // 사원명 초기화
        this.searchname = '';
        return false;
      }
      this.searchKey = 'Z';
      this.searchBmDv();
    },
    searchBmDv: function (cpage) {
      let vm = this;
      this.cpage = cpage || 1;
      let params = new URLSearchParams();
      params.append('pageSize', this.pageSize);
      params.append('cpage', this.cpage);
      if (this.bmUserType == 'D') {
        params.append('loginID', this.bmLoginId);
      }
      // 검색버튼을 눌러서 리스트를 출력하는 경우
      // 파라미터 값으로 검색 조건들을 함께 담아서 보냄
      if (this.searchKey == 'Z') {
        params.append('stdate', this.stdate);
        params.append('eddate', this.eddate);
        params.append('actcd', this.account_cd);
        params.append('lctcd', this.laccount_cd);
        params.append('expyn', this.expyn);

        if (this.bmUserType == 'B' || this.bmUserType == 'C') {
          params.append('searchname', this.searchname);
        }
      }

      this.$vuecombiListAxios('/accounting/vueExpenselist.do', params)
        .then(function (response) {
          vm.expenlist = response.data.expenselist;
          vm.expenlistcnt = response.data.countexpenselist;

          vm.totalPage = vm.$page(vm.expenlistcnt, vm.pageSize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    bclick: function () {
      this.emitter.emit('ComboEvent', this.laccount_cd);
      this.account_cd = '';
      this.keys += 1;
    },
    ComboChange: function () {
      this.emitter.emit('detailCombo', this.account_cd);
    },
    fn_openpopup: async function () {
      const modal = await openModal(vueBmDvModal, {
        receiveAction: 'I',
        receiveObject: {
          userId: this.bmLoginId,
          userNm: this.bmLoginNm,
          today: this.$getToday(),
          rDisabledFlag: true,
        },
      });
      modal.onclose = () => {
        this.searchBmDv();
      };
    },
    //상세페이지 보기
    fn_detailexpense: async function (exp_no, exp_yn, loginID, rAction) {
      // 승인or반려면 false , 승인대기면 true
      // 승인대기면 승인 반려 처리가 가능함
      if (exp_yn == 'Y' || exp_yn == 'N') {
        this.ynFlag = false;
      } else {
        this.ynFlag = true;
      }

      // 작성자와 로그인유저아이디가 동일하면 true
      // 승인 & 반려 못함
      if (loginID == this.bmLoginId) {
        this.myExpFlag = true;
      } else {
        this.myExpFlag = false;
      }

      if (rAction == 'U') {
        this.rAction = 'U';
      } else if (rAction == 'A') {
        this.rAction = 'A';
      }

      // 지출결의서 기본정보 수정 가능 유무
      if (this.myExpFlag && this.ynFlag && this.rAction == 'U') {
        this.rDisabledFlag = true;
      } else {
        this.rDisabledFlag = false;
      }

      const modal = await openModal(vueBmDvModal, {
        receiveAction: this.rAction,
        receiveObject: {
          rExpNo: exp_no, // 지출결의번호
          rExpYn: exp_yn, // 승인반려여부
          //rWriterId: loginID, // 작성자아이디
          myExpFlag: this.myExpFlag,
          ynFlag: this.ynFlag,
          rDisabledFlag: this.rDisabledFlag,
        },
      });
      modal.onclose = () => {
        this.searchBmDv(this.cpage);
      };
    },
  },
};
</script>
