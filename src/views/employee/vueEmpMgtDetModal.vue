<template>
  <div id="layer1" class="layerType2" style="width: 790px">
    <form id="detail" action="" method="">
      <input type="hidden" name="pay_nego" id="pay_nego" v-model="pay_nego" />
      <!-- <input
        type="hidden"
        name="detLoginId"
        id="detLoginId"
        v-model="detLoginId"
      /> -->
      <dl>
        <dt>
          <strong>사원 정보</strong>
        </dt>
        <dd class="content">
          <!-- s : 여기에 내용입력 -->
          <table class="row">
            <caption>
              caption
            </caption>
            <colgroup>
              <col width="18%" />
              <col width="14%" />
              <col width="20%" />
              <col width="14%" />
              <col width="20%" />
            </colgroup>

            <tbody>
              <tr>
                <td rowspan="3" id="userProfile" class="userProfile profile">
                  <div v-html="profilePreview"></div>
                  <input
                    type="file"
                    name="profileUpload"
                    id="profileUpload"
                    @change="uploadFile"
                    :disabled="profileUploaddisabled"
                  />
                </td>
                <th scope="row">사번</th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="emp_no"
                    name="emp_no"
                    id="emp_no"
                    readonly
                  />
                </td>
                <th scope="row">ID</th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="loginID"
                    name="loginID"
                    id="loginID"
                    readonly
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">사원명</th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="name"
                    name="name"
                    id="name"
                    readonly
                  />
                </td>
                <th scope="row">생년월일</th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="birthday"
                    name="birthday"
                    id="birthday"
                    readonly
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">성별</th>
                <td>
                  <select
                    id="sex"
                    v-model="sex"
                    name="sex"
                    style="width: 65%"
                    disabled
                  >
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </td>
                <th scope="row">최종학력<span class="font_red">*</span></th>
                <td>
                  <ComCombo
                    group_code="school_cd"
                    selectid="schoolname"
                    name="detSchoolCd"
                    id="detSchoolCd"
                    type="sel"
                    :selvalue="detSchoolCd"
                    :disabled="detSchoolCddisabled"
                    eventid="selectSchool"
                    v-model="detSchoolCd"
                    style="width: 100px; height: 20px"
                    ref="Com_combo"
                  ></ComCombo>
                  <!-- <select
                  name="detSchoolCd"
                  v-model="detSchoolCd"
                  id="detSchoolCd"
                  style="width: 50%"
                ></select> -->
                </td>
              </tr>
            </tbody>
          </table>
          <table class="row" style="margin-top: 0.5%">
            <colgroup>
              <col width="12%" />
              <col width="31%" />
              <col width="12%" />
              <col width="36%" />
            </colgroup>

            <tbody>
              <tr>
                <th scope="row">이메일<span class="font_red">*</span></th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="email"
                    name="email"
                    id="email"
                    ref="refemail"
                    :disabled="emaildisabled"
                  />
                </td>

                <th scope="row">연락처<span class="font_red">*</span></th>
                <td>
                  <input
                    class="inputTxt"
                    style="width: 28%"
                    maxlength="4"
                    type="text"
                    v-model="hp1"
                    ref="refhp1"
                    id="hp1"
                    name="hp1"
                    :disabled="hp1disabled"
                  />

                  -
                  <input
                    class="inputTxt"
                    style="width: 28%"
                    maxlength="4"
                    type="text"
                    v-model="hp2"
                    ref="refhp2"
                    id="hp2"
                    name="hp2"
                    :disabled="hp2disabled"
                  />
                  -
                  <input
                    class="inputTxt"
                    style="width: 28%"
                    maxlength="4"
                    type="text"
                    v-model="hp3"
                    ref="refhp3"
                    id="hp3"
                    name="hp3"
                    :disabled="hp3disabled"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row" rowspan="3">
                  주소<span class="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    class="inputTxt"
                    style="width: 50%"
                    v-model="zip_code"
                    name="zip_code"
                    id="ddetRankCdetZip"
                    readonly
                  />
                  <input
                    type="button"
                    value="우편번호 찾기"
                    @click="DaumPostcode()"
                    id="post_cd"
                    style="width: 35%; height: 50%; cursor: pointer"
                    :disabled="postcddisabled"
                  />
                </td>
                <th scope="row">은행계좌<span class="font_red">*</span></th>
                <td>
                  <ComCombo
                    group_code="bank_cd"
                    selectid="bankname"
                    type="sel"
                    name="detBankCd"
                    id="detBankCd"
                    :selvalue="detBankCd"
                    :disabled="detBankCddisabled"
                    eventid="selectBank"
                    v-model="detBankCd"
                    style="width: 100px; height: 20px"
                    ref="Com_combo"
                  ></ComCombo>
                  <!-- <select
                  id="detBankCd"
                  v-model="detBankCd"
                  name="detBankCd"
                  style="width: 40%"
                ></select> -->
                  <input
                    class="inputTxt"
                    style="width: 63%"
                    type="text"
                    id="account"
                    v-model="account"
                    ref="refaccount"
                    name="account"
                    :disabled="accountdisabled"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    class="inputTxt"
                    style="width: 90%"
                    v-model="addr"
                    name="addr"
                    id="addr"
                    readonly
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="det_addr"
                    name="det_addr"
                    id="det_addr"
                    :disabled="detaddrdisabled"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <table class="row" style="margin-top: 0.5%">
            <colgroup>
              <col width="13%" />
              <col width="17%" />
              <col width="12%" />
              <col width="20%" />
              <col width="11%" />
              <col width="18%" />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">권한<span class="font_red">*</span></th>
                <td>
                  <ComCombo
                    group_code="user_type"
                    selectid="usertype"
                    type="sel"
                    id="detUserType"
                    name="detUserType"
                    :selvalue="detUserType"
                    :disabled="detUserTypedisabled"
                    eventid="selectUsertype"
                    v-model="detUserType"
                    style="width: 100px; height: 20px"
                    ref="Com_combo"
                  ></ComCombo>
                  <!-- <select
                  id="detUserType"
                  v-model="detUserType"
                  name="detUserType"
                  style="width: 100%"
                ></select> -->
                </td>
                <th scope="row">부서<span class="font_red">*</span></th>
                <td>
                  <ComCombo
                    group_code="dept_cd"
                    selectid="deptname"
                    type="sel"
                    id="detDeptCd"
                    name="detDeptCd"
                    :selvalue="detDeptCd"
                    :disabled="detDeptCddisabled"
                    eventid="selectDept"
                    v-model="detDeptCd"
                    style="width: 100px; height: 20px"
                    ref="Com_combo"
                  ></ComCombo>
                </td>
                <th scope="row">직급<span class="font_red">*</span></th>
                <td>
                  <ComCombo
                    group_code="rank_cd"
                    selectid="rankname"
                    name="detRankCd"
                    id="detRankCd"
                    type="sel"
                    :selvalue="detRankCd"
                    :disabled="detRankCddisabled"
                    eventid="selectRank"
                    v-model="detRankCd"
                    style="width: 100px; height: 20px"
                    ref="Com_combo"
                  ></ComCombo>
                  <!-- <select
                  id="detRankCd"
                  v-model="detRankCd"
                  name="detRankCd"
                  style="width: 65%"
                ></select> -->
                </td>
              </tr>
              <tr>
                <th scope="row">입사일<span class="font_red">*</span></th>
                <td>
                  <input
                    type="date"
                    id="st_date"
                    v-model="st_date"
                    name="st_date"
                    style="width: 90%; height: 80%"
                    :disabled="stdatedisabled"
                  />
                </td>
                <th scope="row">재직구분</th>
                <td>
                  <ComCombo
                    group_code="status_cd"
                    selectid="statusname"
                    type="sel"
                    :selvalue="statusname"
                    eventid="selectStatus"
                    v-model="statusname"
                    style="width: 100px; height: 20px"
                    ref="Com_combo"
                    disabled
                  ></ComCombo>
                  <!-- <select
                  id="detStatusCd"
                  v-model="detStatusCd"
                  name="detStatusCd"
                  style="width: 65%"
                ></select> -->
                </td>
                <th scope="row">연봉<span class="font_red">*</span></th>
                <td>
                  <template v-if="pay_nego == 0">
                    <input
                      type="number"
                      class="inputTxt"
                      style="width: 67%"
                      v-model="year_pay"
                      placeholder="미협상"
                      name="year_pay"
                      id="year_pay"
                      :disabled="yearpaydisabled"
                    />
                  </template>
                  <template v-else>
                    <input
                      type="number"
                      class="inputTxt"
                      style="width: 67%"
                      v-model="year_pay"
                      name="year_pay"
                      id="year_pay"
                      :disabled="yearpaydisabled"
                    />
                  </template>
                  <template v-if="pay_nego == 0">
                    <input
                      type="button"
                      value="입력"
                      id="negoBtn"
                      @click="fnNego()"
                      style="width: 27%; height: 100%; cursor: pointer"
                      v-show="negoBtn_show"
                    />
                  </template>
                  <template v-else>
                    <input
                      type="button"
                      value="수정"
                      id="negoBtn"
                      @click="fnNego()"
                      style="width: 27%; height: 100%; cursor: pointer"
                      v-show="negoBtn_show"
                    />
                  </template>
                </td>
              </tr>
              <tr id="retirementDate" v-show="retirementDate">
                <th scope="row">퇴사일</th>
                <td>
                  <input
                    type="date"
                    id="ed_date"
                    v-model="ed_date"
                    name="ed_date"
                    style="width: 90%; height: 80%"
                    readonly
                  />
                </td>
              </tr>
              <tr id="vacationPeriod" v-show="vacationPeriod">
                <th scope="row">휴직 시작일</th>
                <td>
                  <input
                    type="date"
                    id="lvst_date"
                    v-model="lvst_date"
                    name="lvst_date"
                    style="width: 90%; height: 80%"
                    readonly
                  />
                </td>
                <th scope="row">휴직 종료일</th>
                <td>
                  <input
                    type="date"
                    id="lved_date"
                    v-model="lved_date"
                    name="lved_date"
                    style="width: 90%; height: 80%"
                    readonly
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div
            class="btn_areaC mt30"
            id="updateBtnArea"
            v-show="updateBtnArea_show"
          >
            <a href="" @click.prevent="fnUpdateEmp()" class="btnType blue"
              ><span>수정</span></a
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
    </form>
  </div>
</template>

<script>
import { closeModal, pushModal, popModal } from 'jenesius-vue-modal';
import ComCombo from '@/components/common/ComCombo.vue';
import DaumZipCode from '@/components/common/DaumZipCode.vue';

export default {
  props: { empMgtDetObj: Object },
  data: function () {
    return {
      empMgtDet: [],

      pay_nego: '',
      detLoginId: '',

      file_name: '',

      emp_no: '',
      name: '',
      birthday: '',
      sex: '',
      detSchoolCd: '',
      email: '',
      loginID: '',
      hp1: '',
      hp2: '',
      hp3: '',
      zip_code: '',
      detBankCd: '',
      account: '',
      addr: '',
      det_addr: '',
      detUserType: '',
      detDeptCd: '',
      detRankCd: '',
      st_date: '',
      detStatusCd: '',
      statusname: '',
      year_pay: '',
      ed_date: '',
      lvst_date: '',
      lved_date: '',
      status_cd: '',
      profilePreview: '',
      currentEmpStatus: '', //재직여부

      negoBtn_show: false,
      retirementDate: false,
      vacationPeriod: false,
      updateBtnArea_show: false,

      emaildisabled: false,
      detSchoolCddisabled: false,
      hp1disabled: false,
      hp2disabled: false,
      hp3disabled: false,
      postcddisabled: false,
      detBankCddisabled: false,
      accountdisabled: false,
      detaddrdisabled: false,
      detUserTypedisabled: false,
      detDeptCddisabled: false,
      detRankCddisabled: false,
      stdatedisabled: false,
      yearpaydisabled: false,
      profileUploaddisabled: false,
    };
  },
  components: {
    ComCombo,
  },

  mounted() {
    this.empMgtDet = this.empMgtDetObj;
    this.fn_empMgtDetail();
  },
  methods: {
    /** 전역컴포넌트 다음 api 함수 */
    DaumPostcode: async function () {
      //다음 전역 컴포넌트 열기
      await pushModal(DaumZipCode);

      //컴포넌트 반환값 가져오기
      this.emitter.on('daumZipResult', (res) => {
        if (res) {
          this.zip_code = res.zonecode;

          // addressType이 R이면 도로명주소, 아니면 지번주소로 입력
          if (res.addressType == 'R') {
            this.addr = res.roadAddress;
          } else {
            this.addr = res.jibunAddress;
          }
          popModal();
        }
      });
    },

    fn_empMgtDetail: function () {
      this.emp_no = this.empMgtDet.emp_no; //사번
      this.loginID = this.empMgtDet.loginID; //아이디
      this.name = this.empMgtDet.name; //이름
      this.birthday = this.empMgtDet.birthday; //생일
      this.sex = this.empMgtDet.sex; //성별
      this.detSchoolCd = this.empMgtDet.school_cd; //최종학력
      this.hp1 = this.empMgtDet.hp.split('-')[0]; //연락처1
      this.hp2 = this.empMgtDet.hp.split('-')[1]; //연락처2
      this.hp3 = this.empMgtDet.hp.split('-')[2]; //연락처3
      this.email = this.empMgtDet.email; //이메일
      this.zip_code = this.empMgtDet.zip_code; //우편번호
      this.addr = this.empMgtDet.addr; //주소
      this.det_addr = this.empMgtDet.det_addr; //상세주소
      this.detBankCd = this.empMgtDet.bank_cd; //은행명
      this.account = this.empMgtDet.account; //계좌번호
      this.detUserType = this.empMgtDet.user_type; //권한
      this.detDeptCd = this.empMgtDet.dept_cd; //부서
      this.detRankCd = this.empMgtDet.rank_cd; //직급
      this.st_date = this.empMgtDet.st_date; //입사일
      this.year_pay = this.empMgtDet.year_pay; //연봉
      this.pay_nego = this.empMgtDet.pay_nego; //연봉협상이력유무
      this.lvst_date = this.empMgtDet.lvst_date; //휴직시작일
      this.lved_date = this.empMgtDet.lved_date; //휴직종료일
      this.ed_date = this.empMgtDet.ed_date; //퇴사일
      this.statusname = this.empMgtDet.status_cd; //재직상태

      //파일올리기 미리보기

      let file_name = this.empMgtDet.file_name;
      //let filearr = [];
      let previewhtml = '';

      if (file_name == '' || file_name == null || file_name == undefined) {
        previewhtml = '';
      } else {
        this.filearr = file_name.split('.');

        if (this.filearr[1] == 'jpg' || this.filearr[1] == 'png') {
          previewhtml =
            "<a>   <img src='" +
            this.empMgtDet.file_nadd +
            "' style='width: 200px; height: 130px;' />  </a>";
        } else {
          previewhtml = '<a>' + this.empMgtDet.file_name + '</a>';
        }
      }
      this.profilePreview = previewhtml;

      if (this.empMgtDet.pay_nego == 0) {
        // 연봉협상버튼
        this.year_pay = '';
      } else {
        this.negoBtn_show = true;
        this.year_pay = this.empMgtDet.year_pay; // 연봉
      }
      this.pay_nego = this.empMgtDet.pay_nego; // 연봉협상유무 0이면 insert

      if (this.empMgtDet.status_cd == 'C') {
        //퇴직
        this.updateBtnArea_show = false;
        this.negoBtn_show = false;
        this.vacationPeriod = false;
        this.retirementDate = true;
        this.emaildisabled = true;
        this.detSchoolCddisabled = true;
        this.hp1disabled = true;
        this.hp2disabled = true;
        this.hp3disabled = true;
        this.postcddisabled = true;
        this.detBankCddisabled = true;
        this.accountdisabled = true;
        this.detaddrdisabled = true;
        this.detUserTypedisabled = true;
        this.detDeptCddisabled = true;
        this.detRankCddisabled = true;
        this.stdatedisabled = true;
        this.yearpaydisabled = true;
        this.profileUploaddisabled = true;
      } else if (this.empMgtDet.status_cd == 'B') {
        //휴직
        this.updateBtnArea_show = true;
        this.negoBtn_show = true;
        this.vacationPeriod = true;
        this.retirementDate = false;
      } else {
        //재직
        this.updateBtnArea_show = true;
        this.negoBtn_show = true;
        this.vacationPeriod = false;
        this.retirementDate = false;
      }
    },

    validationCheck() {
      //빈값 체크
      let checkEmpName = this.$checkNotEmpty([
        ['detSchoolCd', '최종학력을 입력해주세요.'],
        ['email', ' 이메일을 입력하세요.'],
        ['hp1', '전화번호를 입력하세요.'],
        ['hp2', '전화번호를 입력하세요.'],
        ['hp3', '전화번호를 입력하세요.'],
        ['ddetRankCdetZip', '우편번호를 입력하세요.'],
        ['addr', '주소를 입력하세요.'],
        ['det_addr', '상세주소를 입력하세요.'],
        ['detBankCd', '은행을 선택하세요.'],
        ['account', '계좌번호를 입력하세요.'],
        ['detUserType', '권한을 입력해주세요.'],
        ['detDeptCd', '부서를 선택하세요.'],
        ['detRankCd', '직급을 선택하세요.'],
        ['st_date', '입사일을 입력하세요.'],
      ]);
      if (checkEmpName) {
        return checkEmpName;
      }
    },

    fnUpdateEmp: function () {
      //수정 버튼을 눌렀을때

      //이메일 정규식
      const emailRules =
        /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/;
      //전화번호 정규식
      const hp1Rules = /^\d{2,3}$/;
      const hp2Rules = /^\d{3,4}$/;
      const hp3Rules = /^\d{4}$/;
      //계좌번호 정규식
      const accountRules = /^\d{0,20}$/;

      if (this.validationCheck()) {
        if (!emailRules.test(this.email)) {
          alert('이메일 형식을 확인해주세요.');
          this.$refs.refemail.focus();
        } else if (!hp1Rules.test(this.hp1)) {
          alert('전화번호를 확인해주세요.');
          this.$refs.refhp1.focus();
        } else if (!hp2Rules.test(this.hp2)) {
          alert('전화번호를 확인해주세요.');
          this.$refs.refhp2.focus();
        } else if (!hp3Rules.test(this.hp3)) {
          alert('전화번호를 확인해주세요.');
          this.$refs.refhp3.focus();
        } else if (!accountRules.test(this.account)) {
          alert('계좌번호는 숫자만 입력 가능합니다.');
          this.$refs.refaccount.focus();
          return false;
        } else {
          let result = confirm('사원 정보를 수정 하시겠습니까?');
          if (result) {
            let empViewForm = document.getElementById('detail');
            empViewForm.enctype = 'multipart/form-data';

            let fileData = new FormData(empViewForm);
            fileData.append('detLoginId', this.loginID);

            this.$vuecombiListAxios('/employee/updateEmp.do', fileData).then(
              function (res) {
                if (res.data.result == 'SUCCESS') {
                  alert(res.data.resultMsg);
                  closeModal();
                } else {
                  alert('수정 실패하였습니다.');
                }
              }
            );
          }
        }
      }
    },

    uploadFile: function (event) {
      let upfile = this.profilePreview;
      console.log(upfile);

      this.profilePreview = '';
      let image = event.target;

      let imgpath = '';
      if (image.files[0]) {
        imgpath = window.URL.createObjectURL(image.files[0]);

        let filearr = image.files[0].type;

        let previewhtml = '';

        if (
          filearr == 'image/jpeg' ||
          filearr == 'image/png' ||
          filearr == 'image/jpg'
        ) {
          previewhtml =
            "<img src='" +
            imgpath +
            "' style='width: 200px; height: 130px;' />";
        } else {
          previewhtml = '';
        }

        this.profilePreview = previewhtml;
      }
    },

    fnNego: function () {
      //연봉협상

      let params = new URLSearchParams();
      let vm = this;

      if (this.year_pay == '') {
        alert('연봉을 입력해주세요.');
        return false;
      }
      if (this.year_pay == 0) {
        alert('연봉을 0 이상 입력해주세요.');
        return false;
      }
      params.append('loginID', this.loginID);
      params.append('year_pay', this.year_pay);

      if (this.pay_nego == 0) {
        //연봉 협상 테이블에 협상내역이 없을 때 insert
        let result = confirm('연봉을 입력 하시겠습니까?');
        if (result) {
          this.$vuecombiListAxios('/employee/insertNego.do', params).then(
            function (res) {
              vm.pay_nego = -1;

              if (res.data.result == 'SUCCESS') {
                alert(res.data.resultMsg);
              }
            }
          );
        }
      } else {
        let result = confirm('연봉을 수정 하시겠습니까?');
        if (result) {
          this.$vuecombiListAxios('/employee/updateNego.do', params).then(
            function (res) {
              if (res.data.result == 'SUCCESS') {
                alert(res.data.resultMsg);
              }
            }
          );
        }
      }
    },

    close: function () {
      closeModal();
    },
  },
};
</script>
