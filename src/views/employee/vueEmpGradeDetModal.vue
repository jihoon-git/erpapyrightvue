<template>
  <div id="empGradereg" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>승진내역 등록</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row">
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
              <th scope="row">아이디<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="ploginID"
                  v-model="mloginID"
                  id="ploginID"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">발령일자 <span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="date"
                  class="inputTxt p100"
                  name="prmtn_date"
                  v-model="mprmtn_date"
                  id="prmtn_date"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">발령내용<span class="font_red">*</span></th>
              <td colspan="3">
                <ComCombo
                  group_code="rank_cd"
                  selectid="prankCd"
                  type="all"
                  selvalue=""
                  v-model="mprankCd"
                  style="width: 200px"
                  ref="Com_combo"
                ></ComCombo>
              </td>
            </tr>
            <tr>
              <th scope="row">승인자 <span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="prmtn_name"
                  v-model="mprmtn_name"
                  id="prmtn_name"
                  readonly
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="fn_save()"
            class="btnType blue"
            id="btnSave"
            name="btn"
            ><span>저장</span></a
          >
          <a
            href=""
            @click.prevent="close()"
            class="btnType gray"
            id="btnClose"
            name="btn"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" @click.prevent="close()" class="closePop"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';
import ComCombo from '@/components/common/ComCombo.vue';
export default {
  props: {
    ploginID: String,
    prmtn_name: String,
    dEmpNo: String,
    rankname: String,
  },
  data: function () {
    return {
      mloginID: '',
      mprmtn_date: '',
      mprmtn_name: '',
      prankCd: '',
      prankname: '',
    };
  },
  components: {
    ComCombo,
  },

  mounted() {
    let loginInfo = this.$store.state.loginInfo;
    this.loginName = loginInfo.userNm; //로그인 이름
    this.mloginID = this.ploginID;
    this.mprmtn_date = this.getToday();
    this.mprmtn_name = this.loginName;
    this.prankname = this.rankname;
  },
  methods: {
    fn_save: function () {
      if (this.validationCheck()) {
        let saveparam = new URLSearchParams();
        saveparam.append('ploginID', this.mloginID);
        saveparam.append('prmtnno', this.dEmpNo);
        saveparam.append('prmtn_name', this.mprmtn_name);
        saveparam.append('prankCd', this.mprankCd);
        this.$vuecombiListAxios('/employee/empGradesave.do', saveparam).then(
          (response) => {
            if (response.data.result == 'SUCCESS') {
              alert('저장되었습니다!');
            } else {
              alert('오류...');
            }
            this.close();
          }
        );
      }
    },
    getToday: function () {
      var date = new Date();
      var year = date.getFullYear();
      var month = ('0' + (1 + date.getMonth())).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);

      return year + '-' + month + '-' + day;
    },
    validationCheck() {
      console.log('text : ' + this.prankname);
      let checkEmpName = this.$checkNotEmpty([
        ['prankCd', '발령내용을 확인해 주세요'],
      ]);
      if (checkEmpName) {
        if (this.prankname == this.mprankCd) {
          alert('같은 직급으로 승진할 수 없습니다.');
          return false;
        } else if (this.prankname != this.mprankCd) {
          return true;
        }
      }
    },
    close: function () {
      closeModal();
    },
  },
};
</script>
