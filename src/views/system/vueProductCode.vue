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
        <a class="btnType blue" href="" @click.prevent="schPromotion()"
          ><span>검색</span></a
        >
      </span>
    </p>
    <div align="right">
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
        :click-handler="searchProduct"
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
    schPromotion: function () {
      this.searchKey = '';
      this.searchKey = 'Z';
      this.searchProduct();
    },
    //화면초기
    searchProduct: function (currentPage) {
      this.currentPage = currentPage || 1;
      let vm = this;

      let params = new URLSearchParams();
      if (this.searchKey == 'Z') {
        params.append('searchname', this.searchname);
        params.append('cpage', this.currentPage);
        params.append('pageSize', this.pageSize);
      } else {
        params.append('cpage', this.currentPage);
        params.append('pageSize', this.pageSize);
      }
      this.$vuecombiListAxios('/system/vueProductCodeList.do', params)
        .then(function (response) {
          //paginate 설정
          vm.totalCnt = response.data.countproductlist;
          vm.prodlist = response.data.productCodelist;
          //page를 전역변수 사용
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
        })
        .catch((err) => {
          alert(err);
        });
    },

    //초기화면의 등록버튼을 누르면 action = 'I'
    registerProductCodeBtn: async function () {
      const modal = await openModal(vueProductCodeModal, {
        saveModalAction: 'I',
      });

      modal.onclose = () => {
        this.searchProduct();
      };
    },
    // 초기화면에서 요소를 클릭하면 해당 상세보기. 이때 action='U'
    productCodeDetail: async function (detail_code) {
      const modal = await openModal(vueProductCodeModal, {
        sendDetailCode: detail_code,
        saveModalAction: 'U',
      });

      modal.onclose = () => {
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
