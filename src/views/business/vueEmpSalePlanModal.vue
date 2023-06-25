<template>
  <div id="newplan" class="layerType2" style="width: 600px; margin-top: 120px">
    <dl>
      <dt>
        <strong>신규계획등록</strong>
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
          <tbody id="">
            <tr>
              <th scope="row">거래처 이름<span class="font_red">*</span></th>
              <td colspan="3">
                <clientSelectBox
                  client_no="client_no"
                  selectid="client_no"
                  type="all"
                  selvalue=""
                  eventid="vueEmpSalePlan"
                  v-model="client_no"
                  ref="Com_combo"
                  style="margin-right: 3px"
                  id="vclientNo"
                ></clientSelectBox>
              </td>
            </tr>
            <tr>
              <th scope="row">대분류<span class="font_red">*</span></th>
              <td>
                <ProLComCombo
                  group_code="lcategory_cd"
                  selectid="lcategory_cd"
                  type="all"
                  selvalue=""
                  eventid="ProLCombo"
                  v-model="lcategory_cd"
                  @change="ProLclick"
                  ref="Com_combo"
                  style="margin-right: 3px"
                  id="vLcategoryCd"
                ></ProLComCombo>
              </td>
              <th scope="row">중분류<span class="font_red">*</span></th>
              <td>
                <ProMCombo
                  :lcategory_cd="lcategory_cd"
                  selectid="mcategory_cd"
                  type="all"
                  selvalue=""
                  eventid="ProMCombo"
                  v-model="mcategory_cd"
                  @change="ProMclick"
                  ref="Com_combo"
                  style="margin-right: 3px"
                  :key="keys"
                  v-show="categorym"
                  id="vMcategoryCd"
                ></ProMCombo>
                <select name="selectl" id="selectl" v-show="selectl">
                  <option value="">대분류를 선택해주세요</option>
                </select>
              </td>
            </tr>
            <tr>
              <th scope="row">제품<span class="font_red">*</span></th>
              <td>
                <ProSCombo
                  :lcategory_cd="lcategory_cd"
                  :mcategory_cd="mcategory_cd"
                  selectid="product_name"
                  type="all"
                  selvalue=""
                  eventid="ProSCombo"
                  v-model="product_no"
                  @change="ProSclick"
                  ref="Com_combo"
                  style="margin-right: 3px"
                  :key="keysP"
                  v-show="productno"
                  id="vProductNo"
                ></ProSCombo>
                <select name="selectm" id="selectm" v-show="selectm">
                  <option value="">중분류를 선택해주세요</option>
                </select>
              </td>
              <th scope="row">수량<span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="product_amt"
                  id="product_amt"
                  v-show="product_amt"
                  v-model="product_amt_model"
                />
                <input
                  type="text"
                  class="inputTxt p100"
                  name="hidden_amt"
                  id="hidden_amt"
                  v-show="hidden_amt"
                  value="제품을 선택해주세요."
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
            class="btnType blue"
            id="btnSave"
            name="btn"
            @click.prevent="fn_save()"
            ><span>등록</span></a
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
import ProLComCombo from '@/components/common/ProLComCombo.vue';
import ProMCombo from '@/components/common/ProMCombo.vue';
import ProSCombo from '@/components/common/ProSCombo.vue';
import clientSelectBox from '@/components/common/clientSelectBox.vue';
export default {
  props: {},
  data() {
    return {
      group_code: 0,
      client_no: 0,
      clientName: '',
      laccount_cd: '',
      account_name: '',
      lcategory_cd: '',
      mcategory_cd: '',
      product_no: '',

      loginId: '',
      userNm: '',
      userType: '',

      selectl: true,
      categorym: false,
      selectm: true,
      productno: false,
      hidden_amt: true,
      product_amt: false,
      keys: 0,
      keysP: 0,
      // 신규등록시 값저장을 위한 v-model
      product_amt_model: '',
    };
  },
  components: {
    ProLComCombo,
    ProMCombo,
    ProSCombo,
    clientSelectBox,
  },
  unmounted() {
    this.emitter.off('ProLCombo');
    this.emitter.off('ProMCombo');
    this.emitter.off('ProSCombo');
  },
  mounted() {
    let vm = this;
    let loginInfo = vm.$store.state.loginInfo;

    vm.loginID = loginInfo.loginId; //로그인 아이디
    vm.loginName = loginInfo.userNm; //로그인 이름
    vm.user_type = loginInfo.userType; //유저타입
  },
  methods: {
    close: function () {
      closeModal();
    },
    ProLclick: function () {
      this.emitter.emit('ProLCombo', this.lcategory_cd);
      this.mcategory_cd = '';
      this.product_no = '';
      this.selectl = false;
      this.categorym = true;
      this.selectm = true;
      this.productno = false;
      this.keys += 1;
      this.keysP += 1;
    },
    ProMclick: function () {
      this.emitter.emit('ProMCombo', this.mcategory_cd);
      this.selectm = false;
      this.productno = true;
      this.hidden_amt = true;
      this.product_amt = false;
      this.product_no = '';
      this.keysP += 1;
    },

    ProSclick: function () {
      this.product_amt_model = '';
      this.emitter.emit('ProSCombo', this.product_no);
      if (this.product_no == '') {
        this.hidden_amt = true;
        this.product_amt = false;
      } else {
        this.hidden_amt = false;
        this.product_amt = true;
      }
    },

    isValidated: function () {
      let chk = this.$checkNotEmpty([
        ['vclientNo', '거래처 이름을 선택해 주세요.'],
        ['vLcategoryCd', '대분류를 선택해 주세요.'],
        ['vMcategoryCd', '중분류를 선택해 주세요.'],
        ['vProductNo', '제품을 선택해 주세요.'],
        ['product_amt', '수량을 입력해 주세요.'],
      ]);
      return chk;
    },

    fn_save: function () {
      let vm = this;
      if (this.isValidated()) {
        let params = new URLSearchParams();
        params.append('client', this.client_no);
        params.append('lcategory', this.lcategory_cd);
        params.append('mcategory', this.mcategory_cd);
        params.append('product', this.product_no);
        params.append('amount', this.product_amt_model);
        params.append('loginID', this.loginID);
        params.append('plandate', this.getToday());
        params.append('goaldate', this.nextmonthToday());

        this.$vuecombiListAxios('/business/newempsaleplan.do', params).then(
          function (response) {
            console.log('params :' + params);
            console.log('저장 RESPONSE: ' + JSON.stringify(response));
            if (response.data.RESULT == 'SUCCESS') {
              alert('저장 되었습니다.');
              vm.close();
            } else if (response.data.RESULT === 'FAILE') {
              alert('같은 기간, 같은 회사, 같은 제품은 하나만 등록됩니다.');
            }
          }
        );
      }
    }, //fn_saveend

    /** 오늘 날짜 */
    getToday: function () {
      let date = new Date();
      let year = date.getFullYear();
      let month = ('0' + (1 + date.getMonth())).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      return year + '-' + month + '-' + day;
    },

    /** 오늘 날짜에서 한달만 더한 값 */
    nextmonthToday: function () {
      let date = new Date();
      let year = date.getFullYear();
      let month = ('0' + (2 + date.getMonth())).slice(-2);
      if (month >= '13') {
        year = 1 + date.getFullYear();
        month = '01';
      }
      let day = ('0' + date.getDate()).slice(-2);

      return year + '-' + month + '-' + day;
    },
  },
};
</script>
