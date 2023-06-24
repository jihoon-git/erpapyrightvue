<template>
  <div style="width: 600px" class="layerType2">
    <dl>
      <dt>
        <strong>계정과목 등록/수정</strong>
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
            <tr id="claccTitle" v-show="claccTitle_show">
              <!-- insert 할때 -->
              <th scope="row">계정대분류명<span class="font_red">*</span></th>
              <td colspan="3">
                <ComCombo
                  group_code="laccount_cd"
                  selectid="laccount_cd"
                  type="all"
                  selvalue=""
                  eventid="ComboEvent"
                  v-model="laccount_cd"
                  @change="bclick"
                  ref="Com_combo"
                  style="margin-right: 3px"
                ></ComCombo>
              </td>
            </tr>
            <tr id="tlaccTitle" v-show="tlaccTitle_show">
              <!-- update 할때 -->
              <th scope="row">계정대분류명<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="mlaccTitle2"
                  id="mlaccTitle2"
                  readonly
                  v-model="mlaccTitle2"
                />
              </td>
            </tr>
            <tr id="accnt_cd_test" v-show="accnt_cd_test_show">
              <th scope="row">계정과목코드<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="account_cd"
                  id="accountCd"
                  v-model="account_cd"
                />
              </td>
            </tr>
            <tr id="accnt_cd_test2" v-show="accnt_cd_test2_show">
              <th scope="row">계정과목코드<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="account_cd"
                  id="accountCd2"
                  readonly
                  v-model="account_cd2"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">계정과목명 <span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="account_name"
                  id="accountName"
                  v-model="account_name"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">입출구분 <span class="font_red">*</span></th>
              <td colspan="3">
                <select
                  name="account_type"
                  id="accountType"
                  style="width: 150px"
                  v-model="account_type"
                >
                  <option value="">선택</option>
                  <option value="X">수입</option>
                  <option value="O">지출</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            href=""
            class="btnType blue"
            v-if="receiveAction == 'I'"
            @click.prevent="modalSave()"
            ><span>등록</span></a
          >
          <a
            href=""
            class="btnType blue"
            v-if="receiveAction == 'U'"
            @click.prevent="modalSave()"
            ><span>수정</span></a
          >
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
import ComCombo from '@/components/common/ComCombo.vue';

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
      //comcombo
      group_code: 0,

      client_no: 0,
      clientName: '',
      laccount_cd: '',
      laccountName: '',
      testVal: 0,

      modalDetailName: '',
      modalDetailCode: '',

      mlaccTitle: '',
      mlaccTitle2: '',
      detail_name: '',
      account_cd: '',
      account_cd2: '',
      account_name: '',
      account_type: '',

      claccTitle_show: true,
      tlaccTitle_show: false,
      accnt_cd_test_show: true,
      accnt_cd_test2_show: false,

      //props로 가져온 registerProductCodeBtn() action
      receiveAction: '',
      //props로 가져온 productCodeDetail() codedetail
      receiveDetailCode: '',
      chkCnt: 0,
      result: '',
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
      //console.log('start');
    }
  },
  components: {
    ComCombo,
  },
  unmounted() {
    this.emitter.off('ComboEvent');
  },
  methods: {
    isValidated: function () {
      let chk = this.$checkNotEmpty([
        ['accountCd', '계정과목코드를 입력해 주세요.'],
        ['accountName', '계정과목명을 입력해 주세요.'],
        ['accountType', '입출구분을 선택해주세요.'],
      ]);
      return chk;
    },
    //부서 관리 상세조회 mounted, updated
    modalDetail: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('account_cd', this.receiveDetailCode);
      //console.log('receiveDetailCode :' + this.receiveDetailCode);
      this.$vuecombiListAxios('/accounting/detailacc.do', params).then(
        function (response) {
          vm.laccount_cd = response.data.detailacc.laccount_cd;
          vm.mlaccTitle2 = response.data.detailacc.detail_name;
          vm.account_cd = response.data.detailacc.account_cd;
          vm.account_cd2 = response.data.detailacc.account_cd;
          vm.account_name = response.data.detailacc.account_name;
          vm.account_type = response.data.detailacc.account_type;
          vm.receiveAction = 'U';

          vm.claccTitle_show = false;
          vm.tlaccTitle_show = true;
          vm.accnt_cd_test_show = false;
          vm.accnt_cd_test2_show = true;

          //console.log('modalDetail response ' + JSON.stringify(response));
          //console.log('modalDetail action ' + vm.receiveAction);
        }
      );
    },
    //부서 관리 저장
    modalSave: function () {
      let vm = this;
      let params = new URLSearchParams();
      // console.log('this.laccount_cd ' + this.laccount_cd);
      // console.log('this.account_cd ' + this.account_cd);
      // console.log('this.account_name ' + this.account_name);
      // console.log('this.account_type ' + this.account_type);
      //let vm = this;
      if (this.isValidated()) {
        //대분류 등록시에는 mounted
        //무조건 insert를 타야하는 구조임. 그이후에 update, delete 실행후 중복체크도 같이 됨.
        //console.log('receiveAction : ' + this.receiveAction);

        if (this.receiveAction == 'I') {
          const save = confirm('등록 하시겠습니까?');

          if (save) {
            params.append('action', 'I');
            params.append('mlaccTitle', this.laccount_cd);
            params.append('account_cd', this.account_cd);
            params.append('account_name', this.account_name);
            params.append('account_type', this.account_type);
          } else {
            this.modalClose();
            return;
          }

          // params.append('action', 'I');
          // params.append('mlaccTitle', this.laccount_cd);
          // params.append('account_cd', this.account_cd);
          // params.append('account_name', this.account_name);
          // params.append('account_type', this.account_type);

          //params.append('detail_code', this.modalDetailCode);
          // console.log(
          //   'modalSave receiveAction params' + JSON.stringify(params)
          // );

          this.$vuecombiListAxios('/accounting/accTitlesave.do', params).then(
            (response) => {
              if (response.data.result == 'FAILCD') {
                alert(
                  '계정과목코드가 중복 되었습니다. \n 확인 후 다시 입력해주세요. '
                );
                return;
              } else if (response.data.result == 'FAILNM') {
                alert(
                  '계정과목코드명이 중복 되었습니다. \n 확인 후 다시 입력해주세요.'
                );
                return;
              }
              alert('저장 되었습니다');
              vm.modalClose();

              //console.log('결과 ' + JSON.stringify(response));
              // console.log('modalSave response ' + JSON.stringify(response));
            }
          );
        } else if (this.receiveAction == 'U') {
          const update = confirm('수정 하시겠습니까?');

          if (update) {
            params.append('action', 'U');
            params.append('mlaccTitle', this.laccount_cd);
            params.append('account_cd', this.account_cd2);
            params.append('account_name', this.account_name);
            params.append('account_type', this.account_type);
          } else {
            vm.modalClose();
            return;
          }
          // //currentPage param?
          // params.append('action', 'U');
          // params.append('mlaccTitle', this.laccount_cd);
          // params.append('account_cd', this.account_cd2);
          // params.append('account_name', this.account_name);
          // params.append('account_type', this.account_type);

          //console.log('modalSave params' + JSON.stringify(params));

          this.$vuecombiListAxios('/accounting/accTitlesave.do', params).then(
            function (response) {
              if (response.data.result == 'FAILCD') {
                alert(
                  '계정과목코드가 중복 되었습니다. \n 확인 후 다시 입력해주세요. '
                );
                return;
              } else if (response.data.result == 'FAILNM') {
                alert(
                  '계정과목코드명이 중복 되었습니다. \n 확인 후 다시 입력해주세요.'
                );
                return;
              }
              //console.log('modalSave response ' + JSON.stringify(response));
              alert('수정 되었습니다.');
              vm.modalClose();
            }
          );
        }
      }
    },
    modalDelete: function () {
      let params = new URLSearchParams();

      const code_delete = confirm('삭제 하시겠습니까?');

      if (code_delete) {
        params.append('action', 'D');
        params.append('account_cd', this.account_cd);
        console.log('삭제' + this.account_cd);
      } else {
        this.modalClose();
        return;
      }
      // params.append('action', 'D');
      // params.append('account_cd', this.account_cd);
      this.$vuecombiListAxios('/accounting/accTitlesave.do', params).then(
        function (response) {
          if (response.data.result == 'SUCCESS') {
            alert('삭제되었습니다.');
          }
        }
      );
      this.modalClose();
    },
    /** 닫기 버튼  */
    modalClose: function () {
      closeModal();
    },
    bclick: function () {
      this.emitter.emit('ComboEvent', this.laccount_cd);
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
