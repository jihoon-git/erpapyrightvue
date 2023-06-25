<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">실습</span>
    <span class="btn_nav bold">공지사항 관리</span>
    <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
  </p>
  <p class="conTitle">
    <span>거래처 관리</span>
    <span class="fr">
      <a class="btnType blue" href="" @click.prevent="newBizPartner()"
        ><span>거래처 등록</span></a
      >
    </span>
  </p>
  <p class="conTitle">
    <span>검색 관리</span>
    <span class="fr">
      <!-- <select>
							 	<option>거래처명</option>
							 	<option>작성자 휴대폰번호</option>
							 </select> -->
      <input
        type="text"
        placeholder="거래처명을 입력해 주세요."
        style="height: 25px"
        v-model="bpname"
      />
      <a class="btnType blue" href="" @click.prevent="schPromotion"
        ><span>검색</span></a
      >
    </span>
  </p>
  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="10%" />
        <col width="20%" />
        <col width="15%" />
        <col width="15%" />
        <col width="15%" />
        <col width="15%" />
        <col width="10%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">거래처 번호</th>
          <th scope="col">거래처 이름</th>
          <th scope="col">담당자</th>
          <th scope="col">담당자전화</th>
          <th scope="col">email</th>
          <th scope="col">펙스 번호</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <template v-if="countclientlist == 0">
        <tbody>
          <tr>
            <td colspan="7">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody v-for="(list, index) in BPclientlist" :key="index">
          <tr>
            <td>{{ list.client_no }}</td>
            <td>{{ list.client_name }}</td>
            <td>{{ list.manager_name }}</td>
            <td>{{ list.manager_hp }}</td>
            <td>{{ list.manager_email }}</td>
            <td>{{ list.fax_tel }}</td>
            <td>
              <a
                href=""
                @click.prevent="bizPartnerDetailClient(list.client_no)"
                class="btnType gray"
                ><span>확인</span></a
              >
            </td>
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
      :click-handler="clientSearch"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate>
  </div>
</template>
<script>
import { openModal } from 'jenesius-vue-modal';
import Paginate from 'vuejs-paginate-next';
import vueBizPartnerModalVue from './vueBizPartnerModal.vue';
export default {
  data: function () {
    return {
      //초기화면 리스트
      BPclientlist: [],

      //pageinate 설정
      currentPage: 0,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0, //데이터갯수
      grdNo: 1,

      searchKey: '',
      bpname: '',
    };
  },
  mounted() {
    this.clientSearch();
  },
  computed: {},
  components: {
    paginate: Paginate,
  },
  methods: {
    schPromotion: function () {
      this.searchKey = '';
      this.searchKey = 'Z';
      this.clientSearch();
    },
    //초기 화면
    clientSearch: function (currentPage) {
      let vm = this;
      let params = new URLSearchParams();
      this.currentPage = currentPage || 1;

      //'거래처명을입력해 주세요.'에 검색이 없을때
      if (this.searchKey == 'Z') {
        params.append('pageSize', this.pageSize);
        params.append('cpage', this.currentPage);
        if (this.bpname != null) {
          params.append('bpname', this.bpname);
        }
      } else {
        params.append('pageSize', this.pageSize);
        params.append('cpage', this.currentPage);
      }
      this.$vuecombiListAxios('/business/clientlistvue.do', params).then(
        function (response) {
          //paginate 설정
          vm.totalCnt = response.data.countclientlist;
          vm.BPclientlist = response.data.clientlist;
          //page를 전역변수 사용
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
        }
      );
    },

    //거래처등록
    newBizPartner: async function () {
      const modal = await openModal(vueBizPartnerModalVue, {
        saveModalAction: 'I',
      });

      modal.onclose = () => {
        this.clientSearch();
      };
    },

    //상세페이지
    bizPartnerDetailClient: async function (client_no) {
      const modal = await openModal(vueBizPartnerModalVue, {
        sendClientNo: client_no,
        saveModalAction: 'U',
      });

      modal.onclose = () => {
        this.clientSearch();
      };
    },
  },
};
</script>
