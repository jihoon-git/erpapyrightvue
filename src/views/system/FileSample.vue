<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">기준정보</span>
      <span class="btn_nav bold">File Upload</span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle">
      <span>공지사항</span>
      <span>
        <table
          style="collapse; border: 1px #50bcdf;"
          width="100%"
          cellpadding="5"
          cellspacing="0"
          border="1"
          align="left"
        >
          <tr style="border: 0px; border-color: blue">
            <td
              width="50"
              height="25"
              style="font-size: 100%; text-align: left"
            >
              <div id="searchArea" class="d-flex justify-content-around">
                <p style="font-size: 20px; vertical-align: middle">제목</p>
                <input
                  type="text"
                  style="width: 15%"
                  class="form-control"
                  v-model="title"
                />
                <p style="font-size: 20px; vertical-align: middle">작성일</p>
                <input
                  type="date"
                  style="width: 15%"
                  class="form-control"
                  v-model="from_date"
                />
                ~
                <input
                  type="date"
                  style="width: 15%"
                  class="form-control"
                  v-model="to_date"
                />
                <span class="fr">
                  <a
                    @click="listsearch()"
                    class="btn btn-primary mx-2"
                    id="btnSearchGrpcod"
                    name="btn"
                  >
                    <span>검 색</span>
                  </a>
                  <a
                    class="btn btn-light mx-2"
                    @click="searchdetail()"
                    name="modal"
                  >
                    <span>신규등록</span>
                  </a>
                </span>
              </div>
            </td>
          </tr>
        </table>
      </span>
    </p>

    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="6%" />
          <col width="54%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">등록일</th>
            <th scope="col">등록 ID</th>
            <th scope="col">등록자명</th>
            <th scope="col">수정</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt == 0">
            <tr>
              <td colspan="6">일치하는 검색 결과가 없습니다</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="item in items" :key="item.noticeNo">
              <td>{{ item.noticeNo }}</td>
              <td>{{ item.noticeTitle }}</td>
              <td>{{ item.noticeRegdate }}</td>
              <td>{{ item.loginId }}</td>
              <td>{{ item.loginName }}</td>
              <td>
                <a @click="searchdetail(item.noticeNo)" class="btnType3 color1"
                  ><span>수정</span></a
                >
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div id="comnGrpCodPagination">
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
import { openModal } from "jenesius-vue-modal";
import noticeModal from "@/components/system/noticeDetail.vue";
import Paginate from "vuejs-paginate-next";

export default {
  data: function () {
    return {
      items: [],
      noticeDetail: [],
      currentPage: 1,
      pageSize: 5,
      totalPage: 1,
      totalCnt: 0,
      title: "",
      from_date: "",
      to_date: "",
      action: "",
      countShow: true,
      noticeNo: "",
    };
  },
  computed: {},
  components: {
    paginate: Paginate,
  },
  mounted() {
    this.listsearch();
  },
  methods: {
    searchotton: function (pageno) {
      this.currentPage = pageno;
      this.listsearch();
    },
    searchdetail: async function (noticeNo) {
      if (noticeNo == null || noticeNo == "") {
        this.action = "I";

        const modal = await openModal(noticeModal, {
          title: "공지사항 등록",
          pnoticeNo: "",
          action: this.action,
        });

        modal.onclose = () => {
          console.log("Close");
          this.listsearch();
          //return false; //Modal will not be closed
        };
      } else {
        console.log(noticeNo);

        this.action = "U";
        const modal = await openModal(noticeModal, {
          title: "공지사항 수정",
          pnoticeNo: noticeNo,
          action: this.action,
        });

        modal.onclose = () => {
          console.log("Close ");
          this.listsearch();
          //return false; //Modal will not be closed
        };
      }
    },
    listsearch: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      params.append("title", this.title);
      params.append("from_date", this.from_date);
      params.append("to_date", this.to_date);

      this.axios
        .post("/system/noticeListvue.do", params)
        .then(function (response) {
          console.log(response);
          vm.totalCnt = response.data.noticeCnt;
          vm.items = response.data.notice;
          vm.totalPage = vm.page();
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    clickCallback: function (pageNum) {
      console.log(pageNum);

      this.currentPage = pageNum;
      //this.Paginate.pageNum = 10;
      this.listsearch();
    },
    page: function () {
      var total = this.totalCnt;
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
