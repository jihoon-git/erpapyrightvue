<template>
  <div id="userinfoarea" class="mt-5">
    <table>
      <tbody>
        <tr class="basicinfo-row1">
          <td><span>아이디</span></td>
          <td>
            <input
              type="text"
              v-model="detail.loginID"
              name="loginID"
              class="form-control"
            />
          </td>
          <td><span>비밀번호</span></td>
          <td><strong>**********</strong></td>
        </tr>

        <tr class="custInfo" v-if="detail.user_Type == 'C'">
          <td><span>회사명</span></td>
          <td>
            <input
              type="text"
              class="form-control"
              name="client"
              v-model="detail.client"
            />
          </td>
          <td><span>담당자명</span></td>
          <td>
            <input
              type="text"
              class="form-control"
              name="name"
              v-model="detail.name"
            />
          </td>
        </tr>

        <tr class="basicinfo-row2">
          <td><span>연락처</span></td>
          <td>
            <input
              type="text"
              class="form-control"
              name="phone"
              v-model="detail.phone"
            />
          </td>
          <td><span>이메일</span></td>
          <td>
            <input
              type="text"
              class="form-control"
              name="email"
              v-model="detail.email"
            />
          </td>
        </tr>

        <tr class="empInfo" v-if="detail.user_Type != 'C'">
          <td><span>직원명</span></td>
          <td>
            <input
              type="text"
              name="name"
              class="form-control"
              v-model="detail.name"
            />
          </td>
          <td><span>담당업무</span></td>
          <td>
            <select
              v-model="detail.user_Type"
              class="form-control h-auto"
              name="user_Type"
            >
              <option value="A">SCM</option>
              <option value="B">배송</option>
              <option value="D">구매</option>
              <option value="E">임원</option>
            </select>
          </td>
        </tr>

        <tr>
          <td><span>우편번호</span></td>
          <td colspan="4">
            <div class="form-inline">
              <input
                type="text"
                class="form-control"
                name="zipCode"
                v-model="detail.zipCode"
                id="zipCode"
              />
              <button type="button" class="btn" @click="findZip">
                주소찾기
              </button>
            </div>
          </td>
        </tr>

        <tr>
          <td><span>주소</span></td>
          <td colspan="4">
            <input
              type="text"
              v-model="detail.address"
              name="address"
              class="form-control"
              style="width: 100%"
            />
          </td>
        </tr>
        <tr>
          <td><span>상세주소</span></td>
          <td colspan="4">
            <input
              type="text"
              v-model="detail.dtAddress"
              id="dtAddress"
              class="form-control"
              style="width: 100%"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="userInfoBtnArea bts">
      <div class="text-right">
        <button
          type="button"
          class="btn btn-primary mx-2"
          @click="edit(userInfo.loginID)"
        >
          수정
        </button>
        <button type="button" class="btn btn-secondary mx-2" @click="close">
          취소
        </button>
      </div>
    </div>
  </div>

  <div id="zipFrame" style="position: absolute; display: none">
    <img src="/images/admin/comm/btn_close.png" id="btn-close-daum" />
  </div>
</template>

<script>
import { openModal, closeModal } from "jenesius-vue-modal";
import DaumPostCode from "@/components/common/DaumZipCode.vue";
export default {
  props: { userInfo: Object },
  data: function () {
    return {
      detail: {},
    };
  },
  watch: {
    userInfo: function (changed) {
      this.detail = changed;
    },
  },
  created: function () {
    this.detail = this.userInfo;
    this.emitter.on("daumZipResult", (payLoad) => {
      this.zipSelectedCallBack(payLoad);
    });
  },
  methods: {
    edit: function (id) {
      this.axios
        .post("/scm/vue/user/" + id, new URLSearchParams(this.userInfo))
        .then((resp) => {
          //let data=resp;
          //let state=resp.status;
          console.log(resp);
        })
        .catch((err) => {
          let resp = err.response;
          console.log(resp);
        });
    },
    close: function () {
      this.emitter.emit("close", null);
    },
    findZip: function () {
      openModal(DaumPostCode);
    },
    zipSelectedCallBack: function (payLoad) {
      this.detail.zipCode = payLoad.zonecode;
      if (payLoad.userSelectedType == "R") {
        this.detail.address = payLoad.roadAddress;
      } else {
        this.detail.dtAddress = payLoad.jibunAddress;
      }
      closeModal(DaumPostCode);
      document.getElementById("dtAddress").focus();
    },
  },
};
</script>
