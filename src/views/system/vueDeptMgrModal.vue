<template>
  <div style="width: 600px" class="layerType2">
    <dl>
      <dt>
        <strong>부서 등록/수정</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row">
          <caption>
            caption
          </caption>
          <colgroup>
            <!-- <col width="120px" />
            <col width="*" />
            <col width="120px" />
            <col width="*" /> -->
          </colgroup>

          <tbody>
            <tr>
              <th scope="row">부서명 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="modalDetailName"
                  id="detail_name"
                />
              </td>
              <!-- <th scope="row">
                <span class="font_red">*</span>
              </th> -->
              <template v-if="saveModalAction == 'I'">
                <!-- <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="modalDetailCode"
                    id="detail_code"
                  />
                </td> -->
              </template>
              <template v-else>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="modalDetailCode"
                    id="detail_code"
                    readonly
                  />
                </td>
              </template>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->
        <div class="btn_areaC mt30">
          <a
            href=""
            class="btnType blue"
            v-if="receiveAction == 'U'"
            @click.prevent="deptcheck()"
            ><span>수정</span></a
          >
          <a
            href=""
            class="btnType blue"
            v-if="receiveAction == 'I'"
            @click.prevent="deptcheck()"
            ><span>등록</span></a
          >

          <!-- <div class="btn_areaC mt30">
          <a href="" class="btnType blue" @click.prevent="deptcheck()"
            ><span>등록</span></a
          > -->
          <!-- update 시에만 삭제버튼 -->
          <a
            href=""
            class="btnType blue"
            v-if="receiveAction == 'U'"
            @click.prevent="modalDelete()"
            ><span>삭제</span></a
          >
          <a href="" class="btnType gray" @click.prevent="modalClose()"
            ><span>닫기</span></a
          >
        </div>
      </dd>
    </dl>
  </div>
</template>
<script>
//import { vuecombiListAxios } from '../system';

import { closeModal } from 'jenesius-vue-modal';

export default {
  props: {
    //registerProductCodeBtn(), productCodeDetail action
    saveModalAction: String,
    //productCodeDetail() codedetail, action
    sendDetailCode: String,
    //sendActionValue: String,
  },
  data() {
    return {
      modalDetailName: '',
      modalDetailCode: '',

      //props로 가져온 registerProductCodeBtn() action
      receiveAction: '',
      //props로 가져온 productCodeDetail() codedetail
      receiveDetailCode: '',
      chkCnt: 0,

      //부서 목록 총 갯수 조회
      countindept: '',
    };
  },
  created() {
    this.receiveAction = this.saveModalAction;
    this.receiveDetailCode = this.sendDetailCode;
  },

  mounted() {
    //console.log('mounted' + this.$el);

    //mounted가 아닌 beforemounted나 creacted에서 선언했어야 하는 값...?
    if (this.receiveAction == 'U') {
      this.modalDetail();
    }
  },

  methods: {
    deptcheck: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('detail_name', this.modalDetailName);
      this.$vuecombiListAxios('/system/check_dept.do', params).then(function (
        result
      ) {
        vm.chkCnt = result.data;

        //console.log('result.data.result ' + JSON.stringify(result));
        //console.log('chkCnt ' + vm.chkCnt);
        vm.modalSave();
      });
    },
    //input box is empty? 공통함수.태그에 id를 넣어서 해당아이디의 값을 있는지 없는지.
    isValidated: function () {
      let chk = this.$checkNotEmpty([
        ['detail_name', '부서명을 입력해 주세요.'],
      ]);
      return chk;
    },
    //부서 관리 상세조회 mounted, updated
    modalDetail: function () {
      let vm = this;
      let params = new URLSearchParams();

      vm.fn_countindept();

      params.append('detail_code', this.receiveDetailCode);
      this.$vuecombiListAxios('/system/detaildept.do', params).then(function (
        response
      ) {
        vm.modalDetailName = response.data.detaildept.detail_name;
        vm.modalDetailCode = response.data.detaildept.detail_code;
        vm.receiveAction = 'U';

        //console.log('modalDetail response ' + JSON.stringify(response));
        //console.log('modalDetail action ' + vm.receiveAction);
        //console.log('modalDetail action ' + vm.receiveAction);
        //console.log('countindept ' + vm.countindept);
      });
    },
    //부서 관리 저장
    modalSave: function () {
      let vm = this;
      let params = new URLSearchParams();
      if (this.isValidated()) {
        //대분류 등록시에는 mounted
        //무조건 insert를 타야하는 구조임. 그이후에 update, delete 실행후 중복체크도 같이 됨.
        //console.log('진짜임 : ' + this.chkCnt);

        if (this.chkCnt == 0) {
          if (this.receiveAction == 'I') {
            const save = confirm('등록 하시겠습니까?');

            if (save) {
              params.append('action', 'I');
              params.append('detail_name', this.modalDetailName);
            } else {
              this.modalClose();
              return;
            }

            //params.append('detail_code', this.modalDetailCode);
            // console.log(
            //   'modalSave receiveAction params' + JSON.stringify(params)
            // );

            this.$vuecombiListAxios('/system/deptsave.do', params).then(
              (response) => {
                if (response.data.result == 'SUCCESS') {
                  alert('등록 되었습니다');
                  vm.modalClose();
                }
                //console.log('결과');
                //console.log('modalSave response ' + JSON.stringify(response));
              }
            );
          } else if (this.receiveAction == 'U') {
            const update = confirm('수정 하시겠습니까?');

            if (update) {
              params.append('action', 'U');
              params.append('detail_name', this.modalDetailName);
              params.append('detail_code', this.modalDetailCode);
            } else {
              this.modalClose();
              return;
            }

            //console.log('modalSave params' + JSON.stringify(params));

            this.$vuecombiListAxios('/system/deptsave.do', params).then(
              function (response) {
                //console.log('modalSave response ' + JSON.stringify(response));
                if (response.data.result == 'SUCCESS') {
                  alert('수정 되었습니다');
                  vm.modalClose();
                }
              }
            );
            //alert('수정 되었습니다.');
            //this.modalClose();
          }
        } else {
          alert('부서명이 중복되었습니다');
        }
      }

      //모달 종료
      //this.modalDetail();
      //this.modalClose();
    },
    //부서 인원 카운트
    fn_countindept: function () {
      let vm = this;
      let params = new URLSearchParams();

      params.append('dept_cd', this.receiveDetailCode);

      this.$vuecombiListAxios('/system/countindept.do', params).then(function (
        response
      ) {
        //console.log('response.data.countindept' + response.data.countindept);
        vm.countindept = response.data.countindept;
      });
    },
    modalDelete: function () {
      let vm = this;
      let params = new URLSearchParams();

      const dept_Delete = confirm('삭제 하시겠습니까?');

      if (dept_Delete) {
        params.append('action', 'D');
        params.append('detail_code', vm.modalDetailCode);
      } else {
        this.modalClose();
        return;
      }
      //부서인원 체크
      if (!this.countindept == 0) {
        alert('해당 부서에 인원이 존재합니다.');
        return;
      }
      this.$vuecombiListAxios('/system/deptsave.do', params).then(function () {
        alert('삭제되었습니다.');
      });
      //this.modalDetail();
      vm.modalClose();
    },
    /** 닫기 버튼  */
    modalClose: function () {
      //let vm = this;
      //this.modalDetail();
      closeModal(this);
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
