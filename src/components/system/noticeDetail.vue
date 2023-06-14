<template>
  <dl id="grpInfoWrap">
    <dd class="content"></dd>
    <!-- s : 여기에 내용입력 -->
    <table id="grpInfo">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="120px" />
        <col width="*" />
        <col width="120px" />
        <col width="*" />
      </colgroup>

      <tbody>
        <tr>
          <td colspan="4" class="text-center">
            <div class="my-4">
              <strong style="font-size: 30px">{{ title }}</strong>
            </div>
          </td>
        </tr>
        <tr v-if="paction == 'U'">
          <th scope="row">번호 <span class="font_red">*</span></th>
          <td>
            <input
              type="text"
              class="form-control"
              name="noticeNo"
              id="noticeNo"
              readonly
              v-model="noticeNo"
            />
          </td>
          <th scope="row">작성자</th>
          <td>
            <input
              type="text"
              class="form-control"
              name="loginName"
              id="loginName"
              readonly
              v-model="loginName"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">제목<span class="font_red">*</span></th>
          <td colspan="3">
            <input
              type="text"
              class="form-control"
              name="noticeTitle"
              id="noticeTitle"
              v-model="noticeTitle"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">내용<span class="font_red">*</span></th>
          <td colspan="3">
            <textarea
              name="noticeContent"
              id="noticeContent"
              v-model="noticeContent"
            ></textarea>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- e : 여기에 내용입력 -->

    <div class="btn_areaC mt30">
      <a @click="save()" class="btn btn-primary" id="btnSaveGrpCod" name="btn">
        <span>저장</span>
      </a>
      <a @click="deletefrpcd()" class="btn btn-danger mx-2" v-show="delshow">
        <span>삭제</span>
      </a>
    </div>
  </dl>
</template>

<script>
import { closeModal } from "jenesius-vue-modal";
export default {
  // vue에서는 받아온 변수를 methods에서 직접 핸들링이 불가능하기 때문에
  // 임시 변수를 만들어서 받아온 변수를 넣어 줘야 함
  props: { title: String, pnoticeNo: Number, action: String },
  data: function () {
    return {
      noticeNo: this.pnoticeNo,
      paction: this.action,
      loginId: "",
      noticeTitle: "",
      noticeContent: "",
      noticeRegdate: "",
      loginName: "",
      delshow: true,
    };
  },
  computed: {},
  // html 로딩, 가상 dom 실행, 이 두 개 연결 시 작동
  mounted: function () {
    let vm = this;
    // 신규 등록 시
    if (this.noticeNo == null || this.noticeNo == "") {
      vm.noticeNo = "";
      vm.noticeTitle = "";
      vm.noticeContent = "";
      vm.noticeRegdate = "";
      vm.loginName = "";

      vm.delshow = false;
    } else {
      //  수정 시 (grp_cod 에 해당하는 상세코드 정보 가져오기)
      let params = new URLSearchParams();
      params.append("noticeNo", this.noticeNo);

      this.axios
        .post("/system/detailNotice.do", params)
        .then(function (response) {
          console.log(response);

          vm.noticeNo = response.data.result.noticeNo;
          vm.noticeTitle = response.data.result.noticeTitle;
          vm.noticeContent = response.data.result.noticeContent;
          vm.noticeRegdate = response.data.result.noticeRegdate;
          vm.loginName = response.data.result.loginName;

          vm.delshow = true;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    }
  },
  methods: {
    save: function () {
      if (confirm("저장하시겠습니까?")) {
        let vm = this;
        let params = new URLSearchParams();

        params.append("grp_cod", this.grp_cod);
        params.append("grp_cod_nm", this.grp_cod_nm);
        params.append("grp_cod_eplti", this.grp_cod_eplti);
        params.append("grp_use_poa", this.grp_use_poa);
        params.append("action", this.action);

        this.axios
          .post("/system/saveComnGrpCod.do", params)
          .then(function (response) {
            console.log(response);
            let status = response.status;
            let msg = response.data.resultMsg;
            if (status == 200) {
              alert(msg);
              closeModal(vm);
            } else {
              alert(msg);
            }
          })
          .catch(function (error) {
            alert("에러! API 요청에 오류가 있습니다. " + error);
          });
      }
    },
    deletefrpcd: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append("grp_cod", this.grp_cod);

      this.axios
        .post("/system/deleteComnGrpCod.do", params)
        .then(function (response) {
          console.log(response);
          alert(response.data.resultMsg);
          closeModal(vm);
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
  },
  created() {
    // 자식요소에서 부모 요소 method 호출
  },
};
</script>

<style>
#grpInfo {
  border-collapse: separate;
  border-spacing: 20px;
}
#grpInfoWrap {
  background-color: #fff;
  padding: 3rem;
  border-radius: 10px;
  border: 2px solid rgb(59, 59, 59);
}
</style>
