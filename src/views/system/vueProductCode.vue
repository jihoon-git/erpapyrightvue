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
          <tr @click="grpdetail(list.detail_code)">
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
    <!-- <paginate
      class="justify-content-center"
      v-model="currentPage2"
      :page-count="page2()"
      :page-range="5"
      :margin-pages="0"
      :click-handler="changePage"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate> -->
  </div>
</template>
<script>
import Paginate from 'vuejs-paginate-next';
import { vuecombiListAxios } from '../system';
export default {
  data: function () {
    return {
      pageSize: 5,
      pageBlockSize: 5,
      prodlist: [],
      prodlistcnt: '',
      prodPagination: '',
      searchname: '',
      clickBtn: '',
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
    searchproduct: function (cpage) {
      cpage = cpage || 1; //현재 page가 undefied면 1로 셋팅

      const vm = this; //axios에서 this인식x
      let params = new URLSearchParams();
      //params.append('searchname', searchname);
      params.append('pageSize', this.pageSize);
      params.append('cpage', cpage);
      vuecombiListAxios('/system/vueProductCodeList.do', params)
        .then(function (response) {
          vm.prodlist = response.data.productCodelist;
          vm.prodlistcnt = response.data.countproductlist;
          console.log(response);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    grpdetail: function (detail_code) {
      console.log('grpdetail detail_code : ' + detail_code);
    },
    changePage: function (pageNum) {
      this.selectPage = pageNum;
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
