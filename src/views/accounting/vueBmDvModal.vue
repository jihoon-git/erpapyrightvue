<template>
  <div
    id="expensereg"
    class="layerType2"
    style="width: 600px; overflow-y: auto"
  >
    <dl>
      <form id="myForm">
        <dt>
          <template v-if="action == 'A'">
            <strong>지출결의서 승인/반려</strong>
          </template>
          <template v-else>
            <strong>지출결의서 등록/수정</strong>
          </template>
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
            </colgroup>

            <tbody>
              <tr>
                <th scope="row">아이디</th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="loginIDreg"
                    id="loginIDreg"
                    v-model="insertUserId"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">사원명</th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="regname"
                    id="regname"
                    v-model="insertUserNm"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">계정대분류명<span class="font_red">*</span></th>
                <td>
                  <template v-if="action == 'I'">
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
                      name="reglctcd"
                      id="reglctcd"
                    ></ComCombo>
                    <!--                 <select
                    name="reglctcd"
                    id="reglctcd"
                    onchange="reglaccountchange()"
                  ></select> -->
                  </template>
                  <template v-else>
                    <ComCombo
                      group_code="laccount_cd"
                      selectid="laccount_cd"
                      type="sel"
                      :selvalue="laccount_cd"
                      eventid="ComboEvent"
                      v-model="laccount_cd"
                      ref="Com_combo"
                      style="margin-right: 3px"
                      name="reglctcd"
                      id="reglctcd"
                      :key="keys"
                      :disabled="!disabledFlag"
                    ></ComCombo>
                  </template>
                </td>
              </tr>
              <tr>
                <th scope="row">상세과목명<span class="font_red">*</span></th>
                <td>
                  <template v-if="action == 'I'">
                    <detileAccount
                      :laccount_cd="laccount_cd"
                      selectid="account_cd"
                      type="all"
                      selvalue=""
                      eventid="detailCombo"
                      v-model="account_cd"
                      @change="ComboChange"
                      ref="Com_combo"
                      :key="keys"
                      style="margin-right: 3px"
                      name="regactcd"
                      id="regactcd"
                      v-show="categorym"
                    ></detileAccount>
                    <!-- <select name="regactcd" id="regactcd"></select> -->
                    <select name="selectl" id="selectl" v-show="selectl">
                      <option value="">대분류를 선택해주세요</option>
                    </select>
                  </template>
                  <template v-else>
                    <detileAccount
                      :laccount_cd="laccount_cd"
                      selectid="account_cd"
                      type="sel"
                      :selvalue="account_cd"
                      eventid="detailCombo"
                      v-model="account_cd"
                      @change="ComboChange"
                      ref="Com_combo"
                      :key="keys"
                      style="margin-right: 3px"
                      name="regactcd"
                      id="regactcd"
                      :disabled="!disabledFlag"
                    ></detileAccount>
                  </template>
                </td>
              </tr>
              <tr>
                <th scope="row">신청일자</th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    id="regdate"
                    v-model="insertToday"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">사용일자<span class="font_red">*</span></th>
                <td>
                  <input
                    type="date"
                    class="inputTxt p100"
                    name="regusedate"
                    id="regusedate"
                    v-model="iRegusedate"
                    :disabled="!disabledFlag"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">지출금액<span class="font_red">*</span></th>
                <td>
                  <input
                    type="number"
                    class="inputTxt p100"
                    name="regspent"
                    id="regspent"
                    v-model="iRegspent"
                    :disabled="!disabledFlag"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">비고</th>
                <td>
                  <textarea
                    name="regexpdet"
                    id="regexpdet"
                    v-model="iRegexpdet"
                    :disabled="!disabledFlag"
                  ></textarea>
                </td>
              </tr>
              <tr id="filetr">
                <th scope="row">증빙서류</th>
                <td>
                  <template v-if="disabledFlag">
                    <input
                      multiple="multiple"
                      type="file"
                      class="inputTxt p100"
                      name="regfile"
                      id="regfile"
                      @change="onFileChange"
                    />
                  </template>
                  <template v-if="action == 'I'">
                    <div v-html="fileview"></div>
                  </template>
                  <template v-else>
                    <div v-html="fileview" @click="fileclick"></div>
                  </template>
                </td>
              </tr>
              <template v-if="action == 'U' && wFlag == false">
                <tr>
                  <th scope="row">승인구분 <span class="font_red">*</span></th>
                  <td colspan="3" style="padding-left: 10px; font-size: 13px">
                    <div v-for="(list, index) in radiolistitem" :key="index">
                      <input
                        type="radio"
                        :value="list.key"
                        v-model="aChecked"
                        :checked="this.wFlag"
                        disabled
                      />
                      <label :for="list.key" class="text">{{
                        list.value
                      }}</label>
                    </div>
                  </td>
                </tr>

                <template v-if="aExpYn == 'N'">
                  <tr id="rejecttr">
                    <th scope="row">반려사유</th>
                    <td>
                      <textarea
                        name="reject_rsn"
                        id="regreject"
                        v-model="iRegreject"
                        readonly
                      ></textarea>
                    </td>
                  </tr>
                </template>
              </template>
              <template v-if="action == 'A'">
                <tr>
                  <th scope="row">승인구분 <span class="font_red">*</span></th>
                  <td colspan="3" style="padding-left: 10px; font-size: 13px">
                    <div v-for="(list, index) in radiolistitem" :key="index">
                      <input
                        type="radio"
                        :value="list.key"
                        v-model="aChecked"
                        @change="radioChange()"
                      />
                      <label :for="list.key" class="text">{{
                        list.value
                      }}</label>
                    </div>
                  </td>
                </tr>
                <tr id="rejecttr" v-show="rejecttr">
                  <th scope="row">반려사유</th>
                  <td>
                    <textarea
                      name="reject_rsn"
                      id="regreject"
                      v-model="iRegreject"
                    ></textarea>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <!-- e : 여기에 내용입력 -->

          <div class="btn_areaC mt30">
            <template v-if="action == 'I'">
              <!-- 신규등록할 때 -->
              <a
                href=""
                @click.prevent="fn_save()"
                class="btnType blue"
                id="btnSavereg"
                name="btn"
                ><span>저장</span></a
              >
            </template>
            <template v-if="action == 'U'">
              <!-- 상세조회/수정할 때 -->
              <template v-if="aMyExpFlag == true && wFlag == true">
                <!--  본인이 작성한 글 이면서 승인대기상태 -->
                <a
                  href=""
                  @click.prevent="fn_save()"
                  class="btnType blue"
                  id="btnSavereg"
                  name="btn"
                  ><span>저장</span></a
                >
                <a
                  href=""
                  @click.prevent="fn_delete()"
                  class="btnType blue"
                  id="btnDeletereg"
                  name="btn"
                  ><span>삭제</span></a
                >
              </template>
            </template>
            <template v-if="action == 'A'">
              <a
                href=""
                @click.prevent="fn_approve()"
                class="btnType blue"
                id="btnSavereg"
                name="btn"
                ><span>저장</span></a
              >
            </template>
            <a
              href=""
              @click.prevent="modalClose()"
              class="btnType gray"
              id="btnClosereg"
              name="btn"
              ><span>취소</span></a
            >
          </div>
        </dd>
      </form>
    </dl>
    <a href="" @click.prevent="modalClose()" class="closePop"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>
<script>
import ComCombo from '@/components/common/ComCombo.vue';
import detileAccount from '@/components/common/detileAccount.vue';
import { closeModal } from 'jenesius-vue-modal';
export default {
  props: { receiveObject: Object, receiveAction: String },
  components: {
    ComCombo,
    detileAccount,
  },
  watch: {
    laccount_cd() {
      this.keys += 1;
    },
  },
  data() {
    return {
      group_code: 0,

      client_no: 0,
      clientName: '',
      laccount_cd: '',
      laccountName: '',
      testVal: 0,
      account_cd: '',
      keys: 0,

      //props로 받은값
      action: '',
      detailObject: {},

      selectl: true,
      categorym: false,

      // 파일 관련
      fileview: '',
      filename: '',
      filephy: '',
      dFilecd: '',
      dFileno: '',

      // 상세조회시
      insertUserId: '',
      insertUserNm: '',
      insertToday: '',
      iRegusedate: '',
      iRegspent: '',
      iRegexpdet: '',
      iRegreject: '',
      regexpno: '',
      iRegexpno: 0,

      // 승인 반려시 필요한 정보
      aExpYn: '',
      aMyExpFlag: false,
      wFlag: false,

      // 읽기전용
      disabledFlag: false,

      radiolistitem: [
        { key: 'y', value: '승인' },
        { key: 'n', value: '반려' },
      ],
      aChecked: '',
      rejecttr: false,
    };
  },
  created() {
    this.detailObject = this.receiveObject;
    this.action = this.receiveAction;
    this.disabledFlag = this.receiveObject.rDisabledFlag;
    console.log(this.disabledFlag);
    if (this.action != 'I') {
      this.regexpno = this.receiveObject.rExpNo;
      this.aMyExpFlag = this.receiveObject.myExpFlag;
      this.wFlag = this.receiveObject.ynFlag;
      this.aExpYn = this.receiveObject.rExpYn;
    }
  },
  unmounted() {
    this.emitter.off('ComboEvent');
    this.emitter.off('detailCombo');
  },
  mounted() {
    if (this.receiveAction == 'I') {
      //등록시 바로 보이게
      this.insertUserId = this.detailObject.userId;
      this.insertUserNm = this.detailObject.userNm;
      this.insertToday = this.detailObject.today;
    } else {
      this.fn_detailone();
    }
  },
  methods: {
    bclick: function () {
      this.emitter.emit('ComboEvent', this.laccount_cd);
      this.account_cd = '';
      this.selectl = false;
      this.categorym = true;
      this.keys += 1;
    },
    ComboChange: function () {
      this.emitter.emit('detailCombo', this.account_cd);
    },
    isValidated: function () {
      var chk = this.$checkNotEmpty([
        ['reglctcd', '계정대분류명을 입력해주세요'],
        ['regactcd', '상세과목명을 입력해주세요'],
        ['regusedate', '사용일자를 입력해주세요'],
        ['regspent', '지출금액을 입력해주세요'],
      ]);

      if (!chk) {
        return;
      }

      return true;
    },
    /** 닫기 버튼  */
    modalClose: function () {
      closeModal();
    },
    onFileChange: function (e) {
      var files = e.target.files;
      var fileType = files[0].type;
      if (
        fileType == 'image/png' ||
        fileType == 'image/jpg' ||
        fileType == 'image/jpeg' ||
        fileType == 'image/bmp'
      ) {
        this.fileview =
          "<img style='width:200px; height:130px' src='" +
          window.URL.createObjectURL(e.target.files[0]) +
          "' />";
      }
    },
    //파일을 클릭하면 다운로드
    fileclick: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append('filecd', this.dFilecd);
      params.append('fileno', this.dFileno);
      this.$vuecombiListAxios(
        '/accounting/expensefiledownload.do',
        params
      ).then((res) => {
        if (res.status == 200) {
          var FILE = window.URL.createObjectURL(new Blob([res.data]));
          var docUrl = document.createElement('a');
          docUrl.href = FILE;
          docUrl.setAttribute('download', vm.filename);
          document.body.appendChild(docUrl);
          docUrl.click();
        }
      });
    },
    // 상세조회 메소드
    fn_detailone: async function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('expno', this.regexpno);
      this.$vuecombiListAxios('/accounting/expensedetail.do', params).then(
        function (response) {
          vm.insertUserId = response.data.detailexpense.loginID;
          vm.insertUserNm = response.data.detailexpense.name;
          vm.laccount_cd = response.data.detailexpense.laccount_cd;
          vm.account_cd = response.data.detailexpense.account_cd;
          vm.insertToday = response.data.detailexpense.exp_date;
          vm.iRegusedate = response.data.detailexpense.use_date;
          vm.iRegspent = response.data.detailexpense.exp_spent;
          vm.iRegexpdet = response.data.detailexpense.exp_det;
          vm.iRegreject = response.data.detailexpense.reject_rsn;

          vm.iRegexpno = response.data.detailexpense.exp_no;
          vm.aChecked = response.data.detailexpense.exp_yn;

          //vm.dFilecd = response.data.detailexpense.file_cd;
          //vm.dFileno = response.data.detailexpense.file_no;
          let file_cd = response.data.detailexpense.file_cd;

          //file_cd 이 있으면
          if (file_cd) {
            vm.file_detail(file_cd);
          }
        }
      );
    },
    fn_save: function () {
      if (this.action != 'D') {
        if (!this.isValidated()) {
          return;
        }
      }
      if (this.iRegusedate > this.insertToday) {
        alert('사용일자가 신청일자 이후가 될 수 없습니다.');
        this.iRegusedate = '';
        return;
      }
      let formData = new FormData(document.getElementById('myForm'));
      formData.enctype = 'multipart/form-data';

      if (this.action == 'I') {
        if (confirm('저장 하시겠습니까?')) {
          formData.append('action', 'I');
          formData.append('loginIDreg', this.insertUserId);
          formData.append('regdate', this.$getToday());

          alert('저장 되었습니다.');
          closeModal();
        }
      } else if (this.action == 'U') {
        if (confirm('수정 하시겠습니까?')) {
          formData.append('action', 'U');

          formData.append('regexpno', this.iRegexpno);
          //formData.append('filecd', this.dFilecd);
          //formData.append('fileno', this.dFileno);

          alert('수정 되었습니다.');
          closeModal();
        }
      } else if (this.action == 'D') {
        if (confirm('삭제 하시겠습니까?')) {
          formData.append('action', 'D');

          formData.append('regexpno', this.iRegexpno);

          alert('삭제 되었습니다.');
          closeModal();
        } else {
          this.action = 'U';
        }
      }

      this.$vuecombiListAxios('/accounting/expensesave.do', formData)
        .then()
        .catch((err) => {
          alert(err);
        });
    },
    // 상세조회시 파일 있으면 파일미리보기
    file_detail: function (file_cd) {
      let vm = this;
      let params = new URLSearchParams();
      params.append('filecd', file_cd);
      this.$vuecombiListAxios('/accounting/detailfile.do', params).then(
        function (response) {
          let file_name_det = response.data.filedetail[0].file_name;
          vm.filename = response.data.filedetail[0].file_name;
          vm.filephy = response.data.filedetail[0].file_madd;
          vm.dFilecd = response.data.filedetail[0].file_cd;
          vm.dFileno = response.data.filedetail[0].file_no;
          //console.log(file_name_det);
          //console.log(response.data);

          let file_namearr = file_name_det.split('.');
          if (
            file_namearr[1] == 'png' ||
            file_namearr[1] == 'jpg' ||
            file_namearr[1] == 'jpeg' ||
            file_namearr[1] == 'bmp'
          ) {
            vm.fileview =
              "<img src='" +
              response.data.filedetail[0].file_nadd +
              "' style ='width: 200px; height: 130px;' />";
          } else {
            vm.fileview = response.data.filedetail[0].file_name;
          }
        }
      );
    },
    fn_approve: function () {
      if (this.aChecked == 'w') {
        alert('승인 구분을 선택해주세요.');
        return;
      } else if (
        this.aChecked == 'n' &&
        (this.iRegreject == '' ||
          this.iRegreject == null ||
          this.iRegreject == undefined)
      ) {
        alert('반려 사유를 작성해주세요.');
        return;
      } else {
        console.log('============');
        console.log(this.aChecked);
        console.log(this.iRegreject);
        const msg = this.aChecked == 'y' ? '승인' : '반려';
        if (confirm(msg + ' 하시겠습니까?')) {
          //let vm = this;
          let params = new URLSearchParams();
          params.append('reject_rsn', this.iRegreject);
          params.append('approvalname', this.$store.state.loginInfo.userNm);
          params.append('approval', this.aChecked);
          params.append('approvaldate', this.$getToday());
          params.append('expno', this.regexpno);

          this.$vuecombiListAxios(
            '/accounting/approvalexpense.do',
            params
          ).then();
          closeModal();
        }
      }
    },
    radioChange: function () {
      if (this.aChecked == 'n') {
        this.rejecttr = true;
      } else {
        this.rejecttr = false;
      }
    },
    fn_delete() {
      this.action = 'D';
      this.fn_save();
    },
  },
};
</script>
