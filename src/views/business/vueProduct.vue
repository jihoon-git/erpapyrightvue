<template>
  <p class="Location">
    <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
    <span class="btn_nav bold">영업</span>
    <span class="btn_nav bold">제품관리</span>
    <a href="../business/vueProduct.do" class="btn_set refresh">새로고침</a>
  </p>

  <p class="conTitle">
    <span>제품관리</span>
    <span class="fr">
      제품대분류
      <ProLComCombo
        group_code="lcategory_cd"
        selectid="lcategory_cd"
        type="all"
        selvalue=""
        eventid="ProLCombo"
        v-model="lcategory_cd"
        @change="ProLclick"
        ref="Com_combo"
        style="margin-right: 3px"
      ></ProLComCombo>
      제품중분류
      <ProMCombo
        :lcategory_cd="lcategory_cd"
        selectid="mcategory_cd"
        type="all"
        selvalue=""
        eventid="ProMCombo"
        v-model="mcategory_cd"
        ref="Com_combo"
        style="margin-right: 3px"
      ></ProMCombo>
      <a
        class="btnType blue"
        id="btnSaveDtlCod"
        name="btn"
        href=""
        @click.prevent="searchList()"
        ><span>조회</span></a
      >
    </span>
  </p>
  <a
    class="btnType blue"
    href=""
    @click.prevent="productPopup()"
    name="modal"
    style="margin-left: 905px"
    ><span>제품등록</span></a
  >
  <div class="divComGrpCodList">
    <table class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="10%" />
        <col width="15%" />
        <col width="15%" />
        <col width="30%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
      </colgroup>

      <thead>
        <tr>
          <th scope="col">제품번호</th>
          <th scope="col">제품대분류</th>
          <th scope="col">제품중분류</th>
          <th scope="col">제품이름</th>
          <th scope="col">단가</th>
          <th scope="col">수량</th>
          <th scope="col">추가수량</th>
        </tr>
      </thead>

      <template v-if="totalCnt == 0">
        <tbody>
          <tr>
            <td colspan="7">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>

      <template v-else>
        <tbody v-for="(list, index) in grouplist" :key="index" id="productList">
          <tr>
            <td>{{ list.product_no }}</td>
            <td>{{ list.lcategory_name }}</td>
            <td>{{ list.mcategory_name }}</td>
            <td>{{ list.product_name }}</td>
            <td>{{ $comma(list.price) }}원</td>
            <td>{{ list.stock }}EA</td>
            <td style="display: flex">
              <input
                type="number"
                id="addStock[index]"
                name="addStock"
                v-model="addStock[index]"
                style="width: 80px; text-align-last: center"
              />
              <button
                type="button"
                @click="insertStock(list.product_no, addStock[index])"
                style="width: 50px"
              >
                추가
              </button>
            </td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
  <!-- 페이징 처리  -->
  <div id="resPagination">
    <paginate
      class="justify-content-center"
      v-model="cpage"
      :page-count="totalPage"
      :page-range="5"
      :margin-pages="0"
      :click-handler="productSearch"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate-next';
import { openModal } from 'jenesius-vue-modal';
import vueProductModal from './vueProductModal.vue';
import ProLComCombo from '@/components/common/ProLComCombo.vue';
import ProMCombo from '@/components/common/ProMCombo.vue';

export default {
  data: function () {
    return {
      pageSize: 5,
      pageBlockSize: 5,

      grouplist: [],
      totalCnt: '',
      productPagination: '',

      lcategory_cd: '',
      mcategory_cd: '',

      searchKey: '',

      mcategory_cd_html: '',
      addStock: [],

      scclientname: '',
      scstdate: '',
      sceddate: '',
      sclcategory: '',
      scmcategory: '',
      scproductname: '',

      loginId: '',
      userNm: '',
      userType: '',

      newclient: '',
      newlcategory: '',
      newmcategory: '',
      newproduct: '',
      newnumber: '',

      popLcategory_cd: '',
      popMcategory_cd: '',
      addMcategory_cd: '',
      popProduct_cd: '',
      addProduct_cd: '',
      insertPrice: '',
      insertStockPop: '',

      newMcategory_cd: '',
      newProduct_cd: '',
      newAddMcategory_cd: '',
      newAddProduct_cd: '',

      newMcategory_cdflag: '',
      newProduct_cdflag: '',
      newAddMcategory_cdflag: '',
      newAddProduct_cdflag: '',
      action: '',

      popMcategory_cd_html: '',
      popProduct_cd_html: '',
      totalPage: 1,
      cpage: 1,
    };
  },
  components: {
    paginate: Paginate,
    ProLComCombo,
    ProMCombo,
  },
  unmounted() {
    this.emitter.off('ProLCombo');
    //this.emitter.off('ProMCombo');
  },
  mounted() {
    let vm = this;
    let loginInfo = vm.$store.state.loginInfo;

    vm.loginID = loginInfo.loginId; //로그인 아이디
    vm.loginName = loginInfo.userNm; //로그인 이름
    vm.userType = loginInfo.userType; //유저타입
    console.log('this.searchKey1 ' + this.searchKey);
    vm.productSearch();
  },
  methods: {
    searchList: function () {
      this.searchKey = 'Z';
      this.productSearch();
    },

    productSearch: function (cpage) {
      let param = new URLSearchParams();
      let vm = this;
      this.cpage = cpage || 1;
      if (this.searchKey != 'Z') {
        param.append('pageSize', this.pageSize);
        param.append('cpage', this.cpage);
        param.append('lcategory_cd', '');
      } else if (this.searchKey == 'Z') {
        param.append('lcategory_cd', this.lcategory_cd);
        param.append('mcategory_cd', this.mcategory_cd);
        param.append('pageSize', this.pageSize);
        param.append('cpage', this.cpage);
      }

      this.$vuecombiListAxios('/business/vueProductList.do', param).then(
        function (res) {
          console.log('res : ' + JSON.stringify(res));
          vm.grouplist = res.data.productList;
          vm.totalCnt = res.data.totalCnt;
          vm.totalPage = vm.$page(vm.totalCnt, vm.pageSize);
        }
      );
    },

    insertStock: function (product_no, addStock) {
      let vm = this;
      let param = new URLSearchParams();
      param.append('product_no', product_no);
      param.append('stock', addStock);
      this.$vuecombiListAxios('/business/vueProductInsertStock.do', param).then(
        (res) => {
          alert('추가되었습니다!');
          vm.addstock = res.data.addStock;

          vm.productSearch();
          vm.addStock = [];
        }
      );
    },
    productPopup: async function () {
      const modal = await openModal(vueProductModal, {});

      modal.onclose = () => {
        this.productSearch(); // 닫기 버튼을 눌렀을 때, 자식창 -> 부모창 메서드를 호출하여 등록된 내용이 리스트에 업데이트 됨.
      };
    },
    ProLclick: function () {
      this.emitter.emit('ProLCombo', this.lcategory_cd);
    },
  },
};
</script>
