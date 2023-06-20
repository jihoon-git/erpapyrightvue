<template>
  <div class="layerType2" style="width: 600px; margin-top: 120px">
    <dl>
      <dt>
        <strong>거래처 정보</strong>
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

          <!-- 디테일 팝업 -->
          <tbody v-show="true">
            <tr>
              <th scope="row">거래처 번호</th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  placeholder="자동으로 입력됩니다."
                  v-model="client_no"
                  readonly
                />
              </td>
              <th scope="row">사업자 번호<span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  placeholder="000-00-00000"
                  id="det_permit_no"
                  v-model="det_permit_no"
                  ref="det_permit_no"
                  :disabled="receiveAction == 'U' ? true : false"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">거래처 이름<span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="det_client_name"
                  v-model="det_client_name"
                  ref="det_client_name"
                  :disabled="receiveAction == 'U' ? true : false"
                />
              </td>
              <th scope="row">담당자 이름<span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="det_manager_name"
                  v-model="det_manager_name"
                  ref="det_manager_name"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">우편번호<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  placeholder="숫자 5자 입니다."
                  id="det_zip_code"
                  v-model="det_zip_code"
                  ref="det_zip_code"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">주소<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  id="det_addr"
                  v-model="det_addr"
                  ref="det_addr"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">상세주소<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  id="det_det_addr"
                  v-model="det_det_addr"
                  ref="det_det_addr"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">담당자 연락처<span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="det_manager_hp"
                  v-model="det_manager_hp"
                  ref="det_manager_hp"
                />
              </td>
              <th scope="row">담당자 이메일<span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="det_manager_email"
                  v-model="det_manager_email"
                  ref="det_manager_email"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">거래처 연락처<span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="det_client_tel"
                  v-model="det_client_tel"
                  ref="det_client_tel"
                />
              </td>
              <th scope="row">
                거래처 팩스 번호<span class="font_red">*</span>
              </th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="det_fax_tel"
                  v-model="det_fax_tel"
                  ref="det_fax_tel"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            href=""
            class="btnType blue"
            @click.prevent="checkPermitNo(this.det_permit_no)"
            ><span>저장</span></a
          >
          <a
            href=""
            class="btnType blue"
            v-if="receiveAction == 'U'"
            @click.prevent="modalDelete"
            ><span>삭제</span></a
          >
          <a href="" class="btnType gray" @click.prevent="modalClose()"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" class="closePop" @click.prevent="modalClose()"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: { saveModalAction: String, sendClientNo: Number },
  data: function () {
    return {
      //props로가져온 값
      receiveAction: '',
      receiveClientNo: '',

      //거래처 등록버튼에서 저장해야할 변수: 11개
      client_no: '',
      det_permit_no: '',
      det_client_name: '',
      det_manager_name: '',
      det_zip_code: '',
      det_addr: '',
      det_det_addr: '',
      det_manager_hp: '',
      det_manager_email: '',
      det_client_tel: '',
      det_fax_tel: '',

      // 거래처 중복체크 결과를 담을 변수
      pNumCheck: '',
    };
  },
  created() {
    //모창(vueBizPartner.vue)에서 올라온값 바로 써야해서 created 해줌
    this.receiveAction = this.saveModalAction;
    this.receiveClientNo = this.sendClientNo;
    console.log('created receiveClientNo ' + this.receiveClientNo);
  },
  mounted() {
    this.modalDetail();
  },

  methods: {
    // 사업자번호 중복 검사를 실행하는 method
    checkPermitNo: function (tmpPermitNo) {
      let vm = this;
      vm.pNumCheck = '';
      if (this.receiveAction == 'I') {
        let params = new URLSearchParams();
        params.append('permit_no', tmpPermitNo);
        this.$vuecombiListAxios('/business/checkPermitNo.do', params).then(
          function (response) {
            console.log('check permit number ' + JSON.stringify(response));
            // 중복된 사업자 번호가 존재할 경우 1이상의 숫자가 반환된다
            if (response.data == 0) {
              vm.pNumCheck = 0;
              vm.modalSave();
            } else {
              vm.pNumCheck = -1;
              alert('중복된 사업자 번호가 존재합니다.');
            }
          }
        );
      } else {
        vm.modalSave();
      }
    },
    //created로 받은 값으로 상세조회 띄우기
    modalDetail: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('client_no', this.receiveClientNo);
      console.log('modalDetail params ' + JSON.stringify(params));
      this.$vuecombiListAxios('/business/clientdetail.do', params).then(
        function (response) {
          vm.client_no = response.data.clientdetail.client_no;
          vm.det_permit_no = response.data.clientdetail.permit_no;
          vm.det_client_name = response.data.clientdetail.client_name;
          vm.det_manager_name = response.data.clientdetail.manager_name;
          vm.det_zip_code = response.data.clientdetail.zip_code;
          vm.det_addr = response.data.clientdetail.addr;
          vm.det_det_addr = response.data.clientdetail.det_addr;
          vm.det_manager_hp = response.data.clientdetail.manager_hp;
          vm.det_manager_email = response.data.clientdetail.manager_email;
          vm.det_client_tel = response.data.clientdetail.client_tel;
          vm.det_fax_tel = response.data.clientdetail.fax_tel;

          vm.receiveAction = 'U';

          console.log('modalDetail response ' + JSON.stringify(response));
          console.log(
            'modalDetail receiveAction ' + JSON.stringify(vm.receiveAction)
          );
        }
      );
    },
    //input box is empty? 공통함수.태그에 id를 넣어서 해당아이디의 값을 있는지 없는지.
    isValidated: function () {
      let chk = this.$checkNotEmpty([
        ['det_permit_no', '사업자 번호를 입력해 주세요.'],
        ['det_client_name', '거래처이름을 입력해 주세요.'],
        ['det_manager_name', '담당자 이름을 입력해 주세요.'],
        ['det_zip_code', '우편번호를 입력해 주세요.'],
        ['det_addr', '주소를 입력해 주세요.'],
        ['det_det_addr', '상세주소를 입력해 주세요.'],
        ['det_manager_hp', '담당자 연락처를 입력해 주세요.'],
        ['det_manager_email', '담당자 이메일을 입력해 주세요.'],
        ['det_client_tel', '거래처 연락처를 입력해 주세요.'],
        ['det_fax_tel', '거래처 팩스 번호를 입력해 주세요.'],
      ]);
      return chk;
    },
    //거래처등록 모달창 //save update data
    modalSave: function () {
      //유효성 검사
      let emailRules =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      let addrRules = /[0-9]{5}/;
      let telRules = /^\d{2,3}-\d{3,4}-\d{4}$/;
      let hpRules = /^\d{3}-\d{3,4}-\d{4}$/;
      let perRules = /^\d{3}-\d{2}-\d{5}$/;
      let koreanRules = /^[가-힣a-zA-Z]+$/;

      if (!perRules.test(this.det_permit_no)) {
        alert('사업자 번호를 확인해주세요. 000-00-00000 양식입니다.').then(
          function () {
            this.$refs.det_permit_no.focus();
            //$('#det_permit_no').focus();
          }
        );
        return false;
      } else if (!koreanRules.test(this.det_client_name)) {
        alert('거래처 이름을 확인해주세요.').then(function () {
          this.$refs.det_client_name.focus();
          //$('#det_client_name').focus();
        });
        return false;
      } else if (!koreanRules.test(this.det_manager_name)) {
        alert('담당자 이름을 확인해주세요.').then(function () {
          this.$refs.det_manager_name.focus();
          //$('#det_manager_name').focus();
        });
        return false;
      } else if (!addrRules.test(this.det_zip_code)) {
        alert('우편번호를 확인해주세요.(숫자 5글자 입니다.)').then(function () {
          this.$refs.det_zip_code.focus();
          //$('#det_zip_code').focus();
        });
        return false;
      } else if (!koreanRules.test(this.det_addr)) {
        alert('주소를 확인해주세요.').then(function () {
          this.$refs.det_addr.focus();
          //$('#det_addr').focus();
        });
        return false;
      } else if (!koreanRules.test(this.det_det_addr)) {
        alert('상세주소를 확인해주세요.').then(function () {
          this.$refs.det_det_addr.focus();
          //$('#det_det_addr').focus();
        });
        return false;
      } else if (!hpRules.test(this.det_manager_hp)) {
        alert('휴대폰번호를 확인해주세요. (-) 포함입니다.').then(function () {
          this.$refs.det_manager_hp.focus();
          //$('#det_manager_hp').focus();
        });
        return false;
      } else if (!emailRules.test(this.det_manager_email)) {
        alert('이메일 형식을 확인해주세요.').then(function () {
          this.$refs.det_manager_email.focus();
          //$('#det_manager_email').focus();
        });
        return false;
      } else if (!telRules.test(this.det_client_tel)) {
        alert('전화번호를 확인해주세요. (-) 포함입니다.').then(function () {
          this.$refs.det_client_tel.focus();
          //$('#det_client_tel').focus();
        });
        return false;
      } else if (!telRules.test(this.det_fax_tel)) {
        alert('팩스번호를 확인해주세요. (-) 포함입니다.').then(function () {
          this.$refs.det_fax_tel.focus();
          //$('#det_fax_tel').focus();
        });
        return false;
      }

      //let vm = this;
      let params = new URLSearchParams();
      if (this.isValidated()) {
        if (this.receiveAction == 'I') {
          params.append('action', 'I');

          params.append('det_permit_no', this.det_permit_no);
          params.append('det_client_name', this.det_client_name);
          params.append('det_zip_code', this.det_zip_code);
          params.append('det_addr', this.det_addr);
          params.append('det_det_addr', this.det_det_addr);
          params.append('det_manager_name', this.det_manager_name);
          params.append('det_manager_hp', this.det_manager_hp);
          params.append('det_client_tel', this.det_client_tel);
          params.append('det_fax_tel', this.det_fax_tel);
          params.append('det_manager_email', this.det_manager_email);

          console.log(
            'modalSave receiveAction params' + JSON.stringify(params)
          );
          this.$vuecombiListAxios('/business/clientsave.do', params).then(
            function (response) {
              console.log(
                'modalSave response ' + JSON.stringify(response.data)
              );
            }
          );
          alert('저장 되었습니다.');
          closeModal();
        } else if (this.receiveAction == 'U') {
          //currentPage param?
          params.append('action', 'U');
          params.append('client_no', this.receiveClientNo);
          params.append('det_permit_no', this.det_permit_no);
          params.append('det_client_name', this.det_client_name);
          params.append('det_zip_code', this.det_zip_code);
          params.append('det_addr', this.det_addr);
          params.append('det_det_addr', this.det_det_addr);
          params.append('det_manager_name', this.det_manager_name);
          params.append('det_manager_hp', this.det_manager_hp);
          params.append('det_client_tel', this.det_client_tel);
          params.append('det_fax_tel', this.det_fax_tel);
          params.append('det_manager_email', this.det_manager_email);

          console.log('modalSave params' + JSON.stringify(params));
          this.$vuecombiListAxios('/business/clientsave.do', params).then(
            function (response) {
              console.log('modalUpdate response ' + JSON.stringify(response));
            }
          );
          alert('수정 되었습니다.');

          closeModal();
        }
      }
    },
    modalDelete: function () {
      let params = new URLSearchParams();
      params.append('action', 'D');
      params.append('client_no', this.client_no);
      this.$vuecombiListAxios('/business/clientsave.do', params).then(
        function () {
          alert('삭제 되었습니다');
          console.log('modalDelete params ' + JSON.stringify(params));
        }
      );
      closeModal();
    },
    modalClose: function () {
      closeModal();
    },
  },
};
</script>
