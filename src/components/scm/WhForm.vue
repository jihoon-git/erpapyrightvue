<template>
  <div id="formwrap" v-if="action">
    <table id="formtable">
      <tr>
        <td v-if="action == 'INFO'">
          <div class="input-group">
            <span class="input-group-text">창고코드</span>
            <input
              type="text"
              v-model="info.wh_id"
              class="form-control"
              readonly
            />
          </div>
        </td>
        <td>
          <div class="input-group">
            <span class="input-group-text">창고명</span>
            <input type="text" class="form-control" v-model="info.wh_nm" />
          </div>
        </td>
        <td v-if="action == 'NEW'">
          <span>창고 위치</span>
          <select id="location" v-model="info.wh_loc" class="form-control">
            <option
              v-for="items in locationList"
              :value="items.dtl_cod"
              :key="items.dtl_cod"
            >
              {{ items.dtl_cod_nm }}
            </option>
          </select>
        </td>
      </tr>
      <tr>
        <td>
          <div class="input-group">
            <span class="input-group-text">담당자</span>
            <select
              id="advisor"
              class="h-auto"
              v-model="info.loginID"
              @change="advisorChoice($event)"
            >
              <option
                v-for="item in advisorList"
                :value="item.dtl_cod"
                :key="item.dtl_cod"
              >
                {{ item.dtl_cod_nm }}
              </option>
            </select>
          </div>
        </td>
        <td>
          <div class="input-group" id="phoneArea">
            <input
              type="text"
              class="form-control text-center"
              ref="head"
              readonly
            />
            <span class="input-group-text bg-white border-white">-</span>
            <input
              type="text"
              class="form-control text-center"
              ref="mid"
              readonly
            />
            <span class="input-group-text bg-white border-white">-</span>
            <input
              type="text"
              class="form-control text-center"
              ref="end"
              readonly
            />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="input-group">
            <span class="input-group-text">E-mail</span>
            <input
              type="text"
              class="form-control text-center"
              v-model="info.email"
              readonly
            />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="input-group">
            <span class="input-group-text">우편번호</span>
            <div class="form-inline">
              <input type="text" class="form-control" v-model="info.zipCode" />
              <input
                type="button"
                id="findAddress"
                class="btn mx-2"
                value="주소찾기"
                @click="findZip"
              />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <span>주소</span>
          <input type="text" class="form-control" v-model="info.addr" />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <span>상세주소</span>
          <input
            id="dtAddress"
            type="text"
            class="form-control"
            v-model="info.dtAddress"
          />
        </td>
      </tr>
    </table>

    <div class="my30 d-flex justify-content-end" style="margin-bottom: 50px">
      <button
        type="button"
        class="btn btn-primary mx-2"
        id="btnRegister"
        v-if="action == 'NEW'"
        @click="manage('POST')"
      >
        등록
      </button>

      <template v-if="action == 'INFO'">
        <button
          type="button"
          class="btn btn-primary mx-2"
          @click="manage('POST', info.wh_id)"
        >
          저장
        </button>
        <button
          type="button"
          class="btn btn-danger mx-2"
          @click="manage('DELETE', info_wh_id)"
        >
          삭제
        </button>
      </template>

      <button type="button" class="btn mx-2" id="close">취소</button>
    </div>
  </div>
</template>

<script>
import DaumZipCode from "../common/DaumZipCode.vue";
import { openModal, closeModal } from "jenesius-vue-modal";

export default {
  data: function () {
    return {
      action: "",
      info: {},
      locationList: [],
      advisorList: [],
      isZipCodeActivate: false,
    };
  },
  created: function () {
    this.emitter.on("requestWhForm", (params) => {
      this.getForm(params);
    });
    this.emitter.on("daumZipResult", (resp) => {
      this.zipSelectCallback(resp);
    });
  },
  updated: function () {
    this.putPhone(this.info.phone);
  },
  methods: {
    getForm: function (params) {
      this.axios
        .post("/scm/vue/whinfo", new URLSearchParams(params))
        .then((resp) => {
          let data = resp.data;

          this.info = data.info;
          this.advisorList = data.advisorList;
          if (params.action == "NEW") {
            this.info.wh_loc = data.locationList[0].dtl_cod;
            this.info.loginID = data.advisorList[0].dtl_cod;
            this.locationList = data.locationList;
          }
          this.action = params.action;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    advisorChoice: function (event) {
      let id = event.target.value;
      let vm = this;
      this.axios.post("/scm/vue/userinfo/" + id).then((resp) => {
        let userinfo = resp.data.userinfo;
        vm.info.email = userinfo.email;
        vm.info.phone = userinfo.phone;
      });
    },
    findZip: () => {
      openModal(DaumZipCode);
    },
    zipSelectCallback(resp) {
      // resp.userSelectedType = (R)oad:도로명 , (J)ibun:지번
      // resp.jibunAddress : 지번 주소
      // resp.roadAddress  : 도로명 주소
      // resp.zonecode : 우편번호
      this.info.zipCode = resp.zonecode;
      if (resp.userSelectedType == "R") {
        this.info.addr = resp.roadAddress;
      } else {
        this.info.addr = resp.jibunAddress;
      }
      closeModal(DaumZipCode);
      document.getElementById("dtAddress").focus();
    },
    putPhone: function (phone) {
      if (phone != null || phone != undefined) {
        let phoneComb = phone.split("-");
        this.$refs.head.value = phoneComb[0];
        this.$refs.mid.value = phoneComb[1];
        this.$refs.end.value = phoneComb[2];
      } else {
        this.$refs.head.value = "";
        this.$refs.mid.value = "";
        this.$refs.end.value = "";
      }
    },
  },
};
</script>
