<template>
  <div>
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">시스템 관리</span>
      <span class="btn_nav bold">제품 대분류 관리</span>
      <a href="../system/productCode.do" class="btn_set refresh">새로고침</a>
    </p>
    <p class="conTitle">
      <span>제품 대분류 관리</span>
      <span class="fr">
        대분류명
        <input type="text" v-model="searchname" />
        <a
          class="btnType blue"
          href=""
          @click.prevent="searchProduct(this.searchname)"
          ><span>검색</span></a
        >
      </span>
    </p>
    <div align="right">
      <!-- 초기화면에서 등록을 누르면 action='I'로 해서 모달에 넘기기 -->
      <a href="" class="btnType blue" @click.prevent="registerProductCodeBtn()"
        ><span>등록</span></a
      >
    </div>
    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="50%" />
          <col width="50%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">대분류명</th>
            <th scope="col">대분류 코드</th>
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
          <tbody v-for="(list, index) in prodlist" :key="index">
            <tr @click="productCodeDetail(list.detail_code)">
              <td>{{ list.detail_name }}</td>
              <td>{{ list.detail_code }}</td>
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
import vueProductCodeModal from './vueProductCodeModal.vue';
// import { vuecombiListAxios } from '../system';

export default {
  mounted() {
    this.searchProduct();
  },
  data: function () {
    return {
      //초기화면 리스트
      prodlist: [],

      //pageinate 설정
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0,
      grdNo: 1,

      //대분류 검색
      searchname: '',
    };
  },
  computed: {},
  components: {
    paginate: Paginate,
  },

  methods: {
    //화면초기
    searchProduct: function (searchname) {
      let vm = this;

      let params = new URLSearchParams();
      if (searchname == null) {
        params.append('cpage', this.currentPage);
        params.append('pageSize', this.pageSize);
      } else {
        params.append('searchname', this.searchname),
          params.append('cpage', this.currentPage);
        params.append('pageSize', this.pageSize);
      }

      this.$vuecombiListAxios('/system/vueProductCodeList.do', params).then(
        function (response) {
          console.log('searchProduct response' + JSON.stringify(response));

          //paginate 설정
          vm.totalCnt = response.data.countproductlist;
          vm.prodlist = response.data.productCodelist;
          //page를 전역변수 사용
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
          //vm.totalPage = vm.page();

          vm.currentPage == 1
            ? (vm.grdNo = 1)
            : (vm.grdNo = 5 * (vm.currentPage - 1) + 1);

          for (let value of vm.prodlist) {
            value.indexNew = vm.grdNo++;
          }
        }
      );
    },

    //paginate callback
    clickCallback: function (pageNum) {
      console.log(pageNum);

      this.currentPage = pageNum;
      //this.Paginate.pageNum = 10;
      this.searchProduct();
    },
    //전역변수로 이미 설정
    //page 설정. 데이터를 page로 나눠줌.
    // page: function () {
    //   var total = this.totalCnt;
    //   var page = this.pageSize;
    //   var xx = total % page;
    //   var result = parseInt(total / page);

    //   if (xx == 0) {
    //     return result;
    //   } else {
    //     result = result + 1;
    //     return result;
    //   }
    // },
    registerProductCodeBtn: async function () {
      const modal = await openModal(vueProductCodeModal, {
        //vueProductCodeModal의 saveModal에 action값 넘김
        saveModalAction: 'I',
      }); //상세보기 클릭은 값을 넘겨야함.

      modal.onclose = () => {
        console.log('Close : ');
        this.searchProduct();
      };
    },
    // 제품 대분류 관리 초기화면에서 요소(대분류명, 대분류코드)를 클릭하면 상세조회
    productCodeDetail: async function (detail_code) {
      const modal = await openModal(vueProductCodeModal, {
        //vueProductCodeModal의 saveModal에 detail_code 값, action 값 넘김)
        sendDetailCode: detail_code,
        saveModalAction: 'U',
      }); //상세보기 클릭은 값을 넘겨야함.

      modal.onclose = () => {
        console.log('Close : ');
        this.searchProduct();
      };
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
