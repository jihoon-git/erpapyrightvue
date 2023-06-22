<template>
  <div id="insertProduct" class="layerType2" style="width: 800px">
    <dl>
      <dt>
        <div id="divtitle" style="color: white">제품등록</div>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="col" style="background-color: aliceblue">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>

          <tr>
            <th scope="col">제품대분류</th>
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
              ></ProLComCombo>
            </td>
          </tr>
          <tr>
            <th scope="col">제품중분류</th>
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
                :key="keys"
                style="width: 70px"
              ></ProMCombo>
            </td>
            <template v-if="mFlag == true">
              <th scope="col">신규중분류등록</th>
              <td>
                <input
                  type="text"
                  v-model="addMcategory_cd"
                  style="
                    width: 125px;
                    height: 30px;
                    text-align-last: center;
                    margin-top: 3px;
                  "
                />
                <button
                  type="button"
                  @click="newProductTypesInsert('M')"
                  style="width: 50px"
                >
                  추가
                </button>
              </td>
            </template>
          </tr>
          <tr>
            <th scope="col">제품</th>
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
                :key="keys"
              ></ProSCombo>
            </td>
            <template v-if="pFlag == true">
              <th scope="col">신규제품등록</th>
              <td>
                <input
                  type="text"
                  id="addProduct_cd"
                  name="addProduct_cd"
                  v-model="addProduct_cd"
                  style="
                    width: 125px;
                    height: 30px;
                    text-align-last: center;
                    margin-top: 3px;
                  "
                />
                <button
                  type="button"
                  @click="newProductTypesInsert('S')"
                  style="width: 50px"
                >
                  추가
                </button>
              </td>
            </template>
          </tr>
          <tr>
            <th scope="col">단가</th>
            <td>
              <input
                type="text"
                v-model="insertPrice"
                style="
                  width: 150px;
                  height: 30px;
                  text-align-last: center;
                  font-weight: bold;
                  font-size: initial;
                "
              />
              <span style="font-weight: bold; font-size: initial">원</span>
            </td>
            <th scope="col">수량</th>
            <td>
              <input
                type="text"
                id="insertStockPop"
                name="insertStockPop"
                v-model="insertStockPop"
                style="
                  width: 150px;
                  height: 30px;
                  text-align-last: center;
                  font-weight: bold;
                  font-size: initial;
                "
              />
              <span style="font-weight: bold; font-size: initial">EA</span>
            </td>
          </tr>
        </table>
        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="productSave()"
            class="btnType blue"
            id="btnUpdateOem"
            name="btn"
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
import ProLComCombo from '@/components/common/ProLComCombo.vue';
import ProMCombo from '@/components/common/ProMCombo.vue';
import ProSCombo from '@/components/common/ProSCombo.vue';
import { closeModal } from 'jenesius-vue-modal';
export default {
  props: {
    popUpItems: String,
  },
  data: function () {
    return {
      lcategory_cd: '',
      mcategory_cd: '',
      product_no: '',
      paramsave: '',
      insertStock: '',
      price: '',
      keys: 0,
      addMcategory_cd: '',
      addProduct_cd: '',
      action: '',
      mFlag: false,
      pFlag: false,
    };
  },
  components: {
    ProLComCombo,
    ProMCombo,
    ProSCombo,
  },
  unmounted() {
    this.emitter.off('ProLCombo');
    this.emitter.off('ProMCombo');
    this.emitter.off('ProSCombo');
  },
  mounted() {
    this.newProductTypesInsert();
  },
  methods: {
    newProductTypesInsert: function (action) {
      this.keys += 1;
      let paraminsert = new URLSearchParams();
      paraminsert.append('lcategory_cd', this.lcategory_cd); // 제품대분류
      paraminsert.append('mProduct_name', this.addMcategory_cd); // 신규중분류등록
      paraminsert.append('mProduct_cd', this.mcategory_cd); // 제품중분류
      paraminsert.append('product_no', this.product_no); // 제품
      paraminsert.append('product_name', this.addProduct_cd); // 신규제품등록
      paraminsert.append('action', action);
      if (action == 'M') {
        if (this.addMcategory_cd == '' && this.mcategory_cd == '') {
          alert('제품중분류를 선택해주세요');
        } else if (this.lcategory_cd == '') {
          alert('제품대분류를 선택해주세요');
        } else {
          this.$vuecombiListAxios(
            '/business/vuenewProductTypesInsert.do',
            paraminsert
          ).then((response) => {
            if (response.data.result == 'SUCCESS') {
              alert('저장되었습니다!');
            } else {
              console.log(this.lcategory_cd);
              console.log(this.addMcategory_cd);
              alert('오류...');
            }
          });
        }
      } else if (action == 'S') {
        if (this.addMcategory_cd == '' && this.mcategory_cd == '') {
          alert('제품중분류를 선택해주세요');
        } else if (this.lcategory_cd == '') {
          alert('제품대분류를 선택해주세요');
        } else if (this.product_no == '' && this.addProduct_cd == '') {
          alert('제품을 선택해주세요');
        } else {
          this.$vuecombiListAxios(
            '/business/vuenewProductTypesInsert.do',
            paraminsert
          ).then((response) => {
            if (response.data.result == 'SUCCESS') {
              alert('저장되었습니다!');
              this.$parent.productSearch();
            } else {
              console.log(this.lcategory_cd);
              console.log(this.addMcategory_cd);
              alert('오류...');
            }
          });
        }
      }
    },

    productSave: function () {
      let paramsave = new URLSearchParams();
      paramsave.append('lcategory_cd', this.lcategory_cd);
      paramsave.append('mcategory_cd', this.mcategory_cd);
      paramsave.append('product_no', this.product_no);
      paramsave.append('price', this.insertPrice);
      paramsave.append('insertStock', this.insertStockPop);
      if (
        this.lcategory_cd == '' ||
        this.mcategory_cd == '' ||
        this.product_no == '' ||
        this.insertPrice == '' ||
        this.insertStockPop == ''
      ) {
        alert('빈칸을 채워주세요');
        console.log(this.price);
        console.log(this.insertStock);
      } else {
        this.$vuecombiListAxios(
          '/business/vueProductInsertStock.do',
          paramsave
        ).then((response) => {
          if (response.data.result == 'SUCCESS') {
            alert('저장되었습니다!');
          } else {
            alert('오류...');
          }
          //this.close();
        });
        this.close();
      }
    },
    /** 닫기 버튼  */
    close: function () {
      let vm = this;
      console.log('Close Modal');
      closeModal(vm);
    },
    ProLclick: function () {
      this.emitter.emit('ProLCombo', this.lcategory_cd);
      this.product_no = '';
      this.mcategory_cd = '';
      this.keys += 1;
      this.mFlag = true;
    },
    ProMclick: function () {
      this.emitter.emit('ProMCombo', this.mcategory_cd);
      this.mFlag = false;
      this.pFlag = true;
    },

    ProSclick: function () {
      this.emitter.emit('ProSCombo', this.product_no);
      this.pFlag = false;
    },
  },
};
</script>
