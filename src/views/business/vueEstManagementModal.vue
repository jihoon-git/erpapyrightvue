<template>
  <div id="estreg" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>견적서 등록</strong>
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
              <th scope="row">거래처 이름 <span class="font_red">*</span></th>
              <td>
                <clientSelectBox
                  client_no="client_no"
                  selectid="client_no"
                  type="all"
                  selvalue=""
                  eventid="vueBizPartner"
                  v-model="client_no"
                  @change="bclick"
                  ref="Com_combo"
                  style="margin-right: 3px"
                  id="vclientNo"
                ></clientSelectBox>
              </td>
            </tr>
            <tr>
              <th scope="row">대분류 <span class="font_red">*</span></th>
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
              <th scope="row">중분류 <span class="font_red">*</span></th>
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
              <th scope="row">제품 <span class="font_red">*</span></th>
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
              <th scope="row">수량 <span class="font_red">*</span></th>
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
            @click.prevent="remainStock()"
            ><span>등록</span></a
          >
          <a
            href=""
            @click.prevent="close()"
            class="btnType gray"
            id="btnCloseOem"
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
      selectl: true,
      categorym: false,
      selectm: true,
      productno: false,
      hidden_amt: true,
      product_amt: false,
      keys: 0,
      keysP: 0,
      // 신규등록시 값저장을 위한 v-model
      contractno: '',
      product_price: '',
      product_stock: '',
      product_amt_model: '',
    };
  },
  watch: {
    // laccount_cd() {
    //   this.mcategory_cd = '';
    //   this.product_no = '';
    //   console.log(this.product_no);
    //   this.keys += 1;
    //   this.keys2 += 1;
    // },
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
  mounted() {},
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
        let vm = this;
        let params = new URLSearchParams();
        params.append('product_no', this.product_no);

        this.$vuecombiListAxios('/business/savechange.do', params)
          .then(function (response) {
            vm.product_stock = response.data.savechange.stock;

            /* 제품선택시 남은수량이 0인경우 alert 후 초기화 */
            if (vm.product_stock == 0) {
              alert(
                '선택하신 제품이 품절되었습니다. \n다른 제품을 선택해주세요.'
              );
              vm.product_no = '';
              vm.keysP += 1;
              //fn_openpopup();
            } else {
              vm.product_price = response.data.savechange.price;
              vm.product_stock = response.data.savechange.stock;
            }
          })
          .catch(function (error) {
            alert('에러! API 요청에 오류가 있습니다. ' + error + '품절확인');
          });
      }
    },
    remainStock: function () {
      let minusstock = this.product_amt_model;
      let currentstock = this.product_stock;
      let amtstock = currentstock - minusstock;

      if (amtstock < 0) {
        alert(
          '선택하신 물품이 작성한 남은 수량보다 적습니다. \n현재 남은 수량 :' +
            currentstock
        );
        this.product_amt_model = '';
        this.product_no = '';
        this.keysP += 1;
      } else {
        this.Estsave();
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
    Estsave: function () {
      let vm = this;
      if (this.isValidated()) {
        let params = new URLSearchParams();
        params.append('client_no', this.client_no);
        params.append('lcategory_cd', this.lcategory_cd);
        params.append('mcategory_cd', this.mcategory_cd);
        params.append('product_no', this.product_no);
        params.append('product_amt', this.product_amt_model);
        params.append('price', this.product_price);

        this.$vuecombiListAxios('/business/estsave.do', params)
          .then(function (response) {
            if (response.data.result == 'SUCCESS') {
              alert('저장 되었습니다.');
              vm.close();
            }
          })
          .catch(function (error) {
            alert('에러! API 요청에 오류가 있습니다. ' + error);
          });
      }
    },
  },
};
</script>
