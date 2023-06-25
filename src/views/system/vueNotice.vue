<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">실습</span>
    <span class="btn_nav bold">공지사항 관리</span>
    <a href="../system/notice.do" class="btn_set refresh">새로고침</a>
  </p>
  <p class="conTitle">
    <span>공지사항</span>
    <span class="fr">
      제목
      <input type="text" v-model="scrtitle" />
      <input type="date" v-model="srcsdate" /> ~
      <input type="date" v-model="srcedate" />
      <a class="btnType blue" href="" @click.prevent="schPromotion()"
        ><span>검색</span></a
      >
    </span>
  </p>
  <div align="right">
    <template v-if="this.noticeUserType == 'A'">
      <a class="btnType blue" href="" @click.prevent="initpopup()"
        ><span>등록</span></a
      >
    </template>
  </div>
  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="6%" />
        <col width="57%" />
        <col width="17%" />
        <col width="20%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">날짜</th>
        </tr>
      </thead>
      <template v-if="countnoticelist == 0">
        <tbody>
          <tr>
            <td colspan="4">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody v-for="(list, index) in grouplist" :key="index">
          <tr>
            <td>{{ list.notice_no }}</td>
            <td>
              <a href="" @click.prevent="fn_detailone(list)">{{
                list.notice_title
              }}</a>
            </td>
            <td>{{ list.writer }}</td>
            <td>{{ list.notice_date }}</td>
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
      :click-handler="searchnotice"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate>
  </div>
</template>
<script>
import vueNoticeModal from './vueNoticeModal.vue';
import Paginate from 'vuejs-paginate-next';
import { openModal } from 'jenesius-vue-modal';
export default {
  data: function () {
    return {
      grouplist: [],

      //pageinate 설정
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      countnoticelist: 0, //데이터갯수
      grdNo: 1,
      //totalCnt: 0, //데이터갯수

      //admin 여부
      noticeUserType: '',

      //검색클릭
      searchKey: '',
      scrtitle: '',
      srcsdate: '',
      srcedate: '',
    };
  },
  mounted() {
    this.searchnotice();
    this.noticeUserType = this.$store.state.loginInfo.userType;
  },
  computed: {},
  components: {
    paginate: Paginate,
  },
  methods: {
    getToday: function () {
      var date = new Date();
      var year = date.getFullYear();
      var month = ('0' + (1 + date.getMonth())).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);

      return year + '-' + month + '-' + day;
    },

    //검색 클릭시
    schPromotion: function () {
      this.searchKey = '';

      const checkDate = this.$checkStartEndDate(this.srcsdate, this.srcedate);
      if (!checkDate) {
        // 검색 종료일 초기화
        this.srcedate = '';
        return false;
      }
      this.searchKey = 'Z';
      this.searchnotice();
    },
    //공지사항 리스트
    searchnotice: function (currentPage) {
      let vm = this;
      let params = new URLSearchParams();
      this.currentPage = currentPage || 1;
      if (this.searchKey == 'Z') {
        params.append('pageSize', this.pageSize);
        params.append('cpage', this.currentPage);
        params.append('scrtitle', this.scrtitle);
        params.append('srcsdate', this.srcsdate);
        params.append('srcedate', this.srcedate);
      } else {
        params.append('pageSize', this.pageSize);
        params.append('cpage', this.currentPage);
      }

      this.$vuecombiListAxios('/system/vueNoticeList.do', params).then(
        (response) => {
          vm.grouplist = response.data.vueNoticelist;
          vm.countnoticelist = response.data.countnoticelist;
          vm.totalPage = vm.$page(vm.countnoticelist, vm.pageSize);
        }
      );
    },
    //상세페이지 보기
    fn_detailone: async function (list) {
      const modal = await openModal(vueNoticeModal, {
        receiveObject: list,
        receiveAction: 'U',
      });
      modal.onclose = () => {
        this.searchnotice();
      };
    },
    //공지 등록
    initpopup: async function () {
      const modal = await openModal(vueNoticeModal, {
        receiveAction: 'I',
        receiveObject: {
          writer: this.$store.state.loginInfo.loginId,
          today: this.getToday(),
        },
      });
      modal.onclose = () => {
        this.searchnotice();
      };
    },
  },
};
</script>
