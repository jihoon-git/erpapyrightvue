<template>
  <form id="salesInfoForm">
    <div id="formwrap" class="bts" v-if="action">
      <div id="salesInfoArea">
        <div class="mt20" id="area-left">
          <div style="max-width: 150px">
            <span v-if="action == 'INFO'" class="form-control"
              >상품번호 : {{ info.sales_id }}</span
            >
            <select
              v-if="action == 'NEW'"
              name="sales_type"
              v-model="info.sales_type"
              class="form-control"
            >
              <option
                :value="item.dtl_cod"
                :key="index"
                v-for="(item, index) in typeBox"
              >
                {{ item.dtl_cod_nm }}
              </option>
            </select>
          </div>

          <div id="salesImgArea">
            <!-- 바인딩된 src 속성은 html 태그의 alt 속성과 연동되지 않는다. -->
            <!-- 해당 src를 찾으려 할때  에러가 날 경우 @error 를 사용하여 이 경로의 src 경로를 alt 경로로 맞추어 주어야 한다. -->
            <img
              id="representPhoto"
              :src="representPhoto"
              @error="showBasicImg"
              v-if="action == 'INFO' || action == 'NEW'"
            />
            <!-- icon for register photos -->

            <label for="files" id="l_files"> </label>
            <input
              type="file"
              name="files"
              id="files"
              multiple
              @change="photoPreview"
            />
          </div>
          <!-- preview area -->
          <div id="shortImages" @mouseleave="initMainPhoto">
            <div v-for="item in photos" :key="item.file_server_path">
              <img
                :src="item.file_server_path"
                @mouseover="swapMainPhoto(item.file_server_path)"
              />
            </div>
          </div>
        </div>

        <div id="area-right" class="bts">
          <table>
            <tr>
              <td>모델명</td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="model_nm"
                  v-model="info.model_nm"
                />
              </td>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td>모델번호</td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="model_code"
                  v-model="info.model_code"
                />
              </td>
              <td>제조사</td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="mfcomp"
                  v-model="info.mfcomp"
                />
              </td>
            </tr>
            <tr>
              <td>제품명</td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="sales_nm"
                  v-model="info.sales_nm"
                />
              </td>
              <td>제품가격</td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="price"
                  v-model="info.price"
                  @keydown="fFilterNumber"
                />
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <textarea
                  name="info"
                  id="dtInfoArea"
                  rows="3"
                  class="form-control"
                  style="width: 100%; text-align: left"
                  v-model="info.info"
                ></textarea>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div
        class="salesMngBtnArea text-right"
        style="margin-right: 15px; margin-bottom: 30px"
      >
        <button
          type="button"
          class="btn btn-primary mr-3"
          v-if="action == 'NEW'"
          @click="manage('POST')"
        >
          등록
        </button>
        <button
          type="button"
          class="btn btn-primary mr-3"
          v-if="action == 'INFO'"
          @click="manage('POST', info.sales_id)"
        >
          저장
        </button>
        <button
          type="button"
          class="btn btn-danger"
          v-if="action == 'INFO'"
          @click="manage('DELETE', info.sales_id)"
        >
          삭제
        </button>
        <button type="button" class="btn" id="close" @click="close">
          취소
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data: function () {
    return {
      action: "",
      info: {},
      representPhoto: "",
      photos: [],
      typeBox: [],
    };
  },
  // Life Cycle to do
  created: function () {
    // SalesList.vue 에서 상품 보기 및 제품 등록 요청시
    // 받는 이벤트 리스너 등록
    this.emitter.on("requestForm", (param) => {
      this.getForm(param.action, param.idx || 0);
    });
  },
  destroy: function () {
    this.emitter.off("requestForm");
  },
  watch: {
    action: function (changed) {
      if (changed == "") {
        this.info = {};
        (this.representPhoto = ""), (this.photos = []);
        this.typeBox = [];
      }
    },
  },
  // Declare Methods
  methods: {
    // get form by action (New : Create , INFO : Retreive, idx : sales PK for Retreive)
    getForm: function (action, idx) {
      this.close();

      this.axios
        .post(
          "/scm/vue/sales/" + action + "/" + (idx = idx == undefined ? 0 : idx)
        )
        .then((resp) => {
          let data = resp.data;
          this.action = action;
          this.info = data.info;
          this.photos = data.info.files;
          if (this.photos != null && this.photos.length > 0) {
            this.representPhoto = this.photos[0].file_server_path;
          }

          if (action == "NEW") {
            this.info.sales_type = "board";
            this.axios
              .post(
                "/commonproc/comcombo.do",
                new URLSearchParams({ group_code: "proCD" })
              )
              .then((resp) => {
                let data = resp.data;
                this.typeBox = data.list;
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // Create, Update, Delete Methods by action and salesID
    // action : 'POST ', salesID : undefined  = CREATE
    // action : 'POST' , salesID : hasValue = UPDATE
    // action : 'DELETE' = DELETE
    manage: function (action, salesID) {
      salesID = salesID || 0;

      let confirmMsg =
        action == "POST" && salesID == 0
          ? "등록하시겠습니까?"
          : action == "POST"
          ? "정말로 수정하시겠습니까?"
          : "정말로 삭제하시겠습니까? 삭제한 정보는 되돌릴 수 없습니다";
      if (confirm(confirmMsg)) {
        var vue = this;
        this.axios(
          {
            url: "/scm/vue/manage/" + salesID,
            method: action,
            data: new FormData(document.getElementById("salesInfoForm")),
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
          .then(function (resp) {
            let result = resp.data;
            let msg = "오류가 발생했습니다 잠시 후 다시 시도하세요";
            if (result == 1)
              msg =
                action == "POST" && salesID == 0
                  ? "정상적으로 등록되었습니다"
                  : action == "POST"
                  ? "정상적으로 수정되었습니다"
                  : "정상적으로 삭제되었습니다";
            alert(msg);
            vue.close();
            this.emitter.emit("refresh", null);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    // Validation methods...
    fFilterNumber: function (e) {
      let code = e.keyCode;
      // 숫자 허용
      if (code > 47 && code < 58) return;
      // 숫자 허용(숫자 패드)
      if (code > 95 && code < 106) return;
      // 단축키 허용
      if (e.ctrlKey || e.altKey) return;
      // 주요 특수키 허용
      if (
        code === 9 ||
        code === 36 ||
        code === 35 ||
        code === 37 ||
        code === 39 ||
        code === 8 ||
        code === 46
      )
        return;
      return e.preventDefault();
    },
    // UI util methods..
    close: function () {
      this.action = "";
    },
    showBasicImg: function (e) {
      e.target.src = "/images/nonesalesimg.jpg";
    },
    swapMainPhoto: function (src) {
      this.representPhoto = src;
    },
    initMainPhoto: function () {
      this.representPhoto = this.photos[0].file_server_path;
    },
    photoPreview: function (e) {
      var files = e.target.files;
      var allImageType = true;
      let tempPhotos = [];

      // image Type check

      Array.from(files).forEach((item) => {
        if (!item.type.match("image/*")) {
          allImageType = false;
        }
      });
      if (allImageType) {
        Array.from(files).forEach((item) => {
          let path = window.URL.createObjectURL(item);
          tempPhotos.push({ file_server_path: path });
        });
        this.photos = tempPhotos;
        this.representPhoto = tempPhotos[0].file_server_path;
      } else {
        alert("이미지만 등록하실 수 있습니다");
      }
    },
  },
};
</script>
