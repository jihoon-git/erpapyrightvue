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
      <a class="btnType blue" href=""><span>검색</span></a>
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
      :click-handler="clickCallback"
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
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0, //데이터갯수
      grdNo: 1,
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
    //초기 화면
    clientSearch: function () {
      let vm = this;
      let params = new URLSearchParams();

      //'거래처명을입력해 주세요.'에 검색이 없을때
      //if (bpname == null) {
      params.append('pageSize', this.pageSize);
      params.append('cpage', this.currentPage);

      this.$vuecombiListAxios('/business/clientlistvue.do', params).then(
        function (response) {
          console.log('clientSearch response' + JSON.stringify(response));
          //paginate 설정
          vm.totalCnt = response.data.countclientlist;
          //거래처리스트 받기
          vm.BPclientlist = response.data.clientlist;
          //page를 전역변수 사용
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
          //vm.totalPage = vm.page();

          vm.currentPage == 1
            ? (vm.grdNo = 1)
            : (vm.grdNo = 5 * (vm.currentPage - 1) + 1);

          for (let value of vm.BPclientlist) {
            value.indexNew = vm.grdNo++;
          }
        }
      );
      //}
    },
    //전역변수로 page 설정. 데이터를 page로 나눠주는 역할. 이미 설정
    //paginate callback
    clickCallback: function (pageNum) {
      console.log(pageNum);

      this.currentPage = pageNum;
      //this.Paginate.pageNum = 10;
      this.clientSearch();
    },

    //거래처등록
    newBizPartner: async function () {
      const modal = await openModal(vueBizPartnerModalVue, {
        //vueProductCodeModal의 saveModal에 action값 넘김
        saveModalAction: 'I',
      }); //상세보기 클릭은 값을 넘겨야함.

      modal.onclose = () => {
        console.log('Close : ');
        this.clientSearch();
      };
    },

    //상세페이지
    bizPartnerDetailClient: async function (client_no) {
      const modal = await openModal(vueBizPartnerModalVue, {
        //vueProductCodeModal의 saveModal에 detail_code 값, action 값 넘김)
        sendClientNo: client_no,
        saveModalAction: 'U',
      }); //상세보기 클릭은 값을 넘겨야함.
      console.log('bizPartnerDetailClient client_no ' + client_no);
      modal.onclose = () => {
        console.log('Close : ');
        this.clientSearch();
      };
    },
  },
};
</script>
