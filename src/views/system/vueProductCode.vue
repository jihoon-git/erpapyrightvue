<template>
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
      <input
        type="text"
        id="searchname"
        name="searchname"
        v-model="searchname"
      />
      <a class="btnType blue" href="" id="btnSearch" name="btn"
        ><span>검색</span></a
      >
    </span>
  </p>
  <div align="right">
    <a class="btnType blue" @click="javascript: fn_openpopup();" name="modal"
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
      <template v-if="prodlistcnt == 0">
        <tbody>
          <tr>
            <td colspan="5">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody
          id="productlist"
          v-for="list in prodlist"
          :key="list.detail_code"
        >
          <tr>
            <!-- 
            <td>
              <a href="javascript:fn_detailone('${list.detail_code}')"
                >${list.detail_name}</a
              >
            </td>
             -->
            <td>{{ list.detail_name }}</td>
            <td>{{ list.detail_code }}</td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
  <div class="paging_area" id="prodPagination">
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
import Paginate from 'vuejs-paginate-next';
import { vuecombiListAxios } from '../system';
export default {
  data: function () {
    return {
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      pageBlockSize: 5,
      prodlist: [],
      grdNo: 1,

      searchname: '',
      //   clickBtn: '',
    };
  },
  computed: {},
  components: {
    paginate: Paginate,
  },
  mounted() {
    this.searchproduct();
  },
  methods: {
    //제품대분류 관리 초기화면
    searchproduct: function () {
      let vm = this; //axios에서 this인식x
      let params = new URLSearchParams();
      //params.append('searchname', searchname);
      params.append('cpage', this.currentPage);
      params.append('pageSize', this.pageSize);
      params.append('searchname', this.searchname);

      vuecombiListAxios('/system/vueProductCodeList.do', params)
        .then(function (response) {
          //데이터갯수
          vm.totalCnt = response.data.countproductlist;
          //데이터리스트
          vm.prodlist = response.data.productCodelist;
          vm.totalPage = vm.page();

          console.log('searchproduct response : ' + JSON.stringify(response));
          console.log('searchproduct totalPage : ' + vm.totalPage);

          vm.currentPage == 1
            ? (vm.grdNo = 1)
            : (vm.grdNo = 5 * (vm.currentPage - 1) + 1);

          for (let value of vm.prodlist) {
            value.indexNew = vm.grdNo++;
          }
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },

    clickCallback: function (pageNum) {
      console.log('clickCallback pageNum : ' + pageNum);

      this.currentPage = pageNum;
      //this.Paginate.pageNum = 10;
      this.searchproduct();
    },
    page: function () {
      var total = this.totalPage;
      var page = this.pageSize;
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
  },
};
</script>
<style>
#searchArea {
  margin-top: 25px;
  margin-bottom: 25px;
}
#searchArea > * {
  height: auto;
}

#groupTitle {
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}
</style>
