<template>
  <div id="userinfoarea" class="mt-5">
    <table>
      <tbody>
        <tr class="basicinfo-row1">
          <td rowspan="3" style="vertical-align: top">
            <select
              v-model="param.type"
              class="form-control h-auto"
              @change="changeFormEle"
            >
              <option selected value="Cust">기업고객</option>
              <option value="Emp">내부직원</option>
            </select>
          </td>
          <td><span>아이디</span></td>
          <td><input type="text" name="loginID" class="form-control" /></td>
          <td><span>비밀번호</span></td>
          <td>
            <input type="password" name="password" class="form-control" />
          </td>
        </tr>

        <tr class="custInfo" v-if="param.type == 'Cust'">
          <td><span>회사명</span></td>
          <td><input type="text" class="form-control" name="client" /></td>
          <td><span>담당자명</span></td>
          <td><input type="text" class="form-control" name="name" /></td>
        </tr>

        <tr class="basicinfo-row2">
          <td><span>연락처</span></td>
          <td><input type="text" class="form-control" name="phone" /></td>
          <td><span>이메일</span></td>
          <td><input type="text" class="form-control" name="email" /></td>
        </tr>

        <tr class="empInfo" v-if="param.type == 'Emp'">
          <td><span>직원명</span></td>
          <td><input type="text" name="name" class="form-control" /></td>
          <td><span>담당업무</span></td>
          <td>
            <select class="form-control h-auto" name="user_Type">
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
              id="address"
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
              id="dtAddress"
              name="dtAddress"
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
          @click="register('register')"
        >
          등록
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
import DaumPostCode from "@/components/common/DaumZipCode.vue";
import { openModal, closeModal } from "jenesius-vue-modal";

export default {
  data: function () {
    return {
      param: {
        type: "Cust",
      },
    };
  },
  created: function () {
    this.emitter.on("daumZipResult", (payLoad) => {
      this.zipSelectedCallBack(payLoad);
    });
  },
  methods: {
    findZip: function () {
      openModal(DaumPostCode);
    },
    register: function (action) {
      if (confirm("등록하시겠습니까?")) {
        let vm = this;
        let formData = new FormData(document.getElementById("userRegForm"));
        formData.append("action", action);
        this.axios
          .post("/scm/vue/user", formData)
          .then((resp) => {
            if (resp.status == 200) {
              alert("정상적으로 등록되었습니다");
              vm.emitter.emit("refresh", null);
            }
          })
          .catch((err) => {
            let resp = err.response;
            switch (resp.status) {
              case 903: {
                alert("이미 존재하거나 탈퇴한 아이디입니다");
                document.querySelector('input[name="loginID"]').focus();
                break;
              }
              case 500: {
                alert("알 수 없는 요청입니다");
                break;
              }
            }
          });
      }
    },
    zipSelectedCallBack: function (payLoad) {
      document.getElementById("zipCode").value = payLoad.zonecode;
      if (payLoad.userSelectedType == "R") {
        document.getElementById("address").value = payLoad.roadAddress;
      } else {
        document.getElementById("address").value = payLoad.jibunAddress;
      }
      closeModal(DaumPostCode);
      document.getElementById("dtAddress").focus();
    },
    changeFormEle: function (event) {
      this.param.type = event.target.value;
    },
    close: function () {
      if (confirm("등록을 취소하시겠습니까?")) {
        this.emitter.emit("close", null);
      }
    },
  },
};
</script>
