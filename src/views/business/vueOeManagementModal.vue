<template>
  <!-- 모달팝업 신규 등록  -->
  <div id="insertContractPop" class="layerType2" style="width: 800px">
    <dl>
      <dt>
        <div id="divtitle" style="color: white">수주서 신규등록</div>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="col">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">계약서 번호</th>
              <template v-if="estimateNumList.length == 0">
                <th>
                  <select
                    id="estDetaile"
                    @change="estimateDetaile2()"
                    v-model="estDetaile"
                  >
                    <option value="" selected="true">견적서가 없습니다</option>
                  </select>
                </th>
              </template>
              <template v-else>
                <th>
                  <select
                    id="estDetaile"
                    @change="estimateDetaile2()"
                    v-model="estDetaile"
                  >
                    <option value="">선택</option>
                    <template
                      v-for="(item, index) in estimateNumList"
                      :key="index"
                    >
                      <option :value="item.estimate_cd">
                        {{ item.estimate_cd }}
                      </option>
                    </template>
                  </select>
                </th>
              </template>
              <th
                colspan="4"
                style="background-color: aliceblue; border: none"
              ></th>
            </tr>
            <tr>
              <th scope="row">거래처 이름</th>
              <th scope="row">대분류</th>
              <th scope="row">중분류</th>
              <th scope="row">제품</th>
              <th scope="row">수량</th>
              <th scope="row">재고</th>
            </tr>
          </thead>
          <template v-if="estlist.length == 0">
            <tbody id="estimateDetaileList">
              <tr>
                <td colspan="6">견적서 번호를 선택해 주세요.</td>
              </tr>
            </tbody>
          </template>

          <template v-else>
            <template v-for="(item, index) in estlist" :key="index">
              <tbody id="estimateDetaileList">
                <tr>
                  <td>{{ item.client_name }}</td>
                  <td>{{ item.lproduct_name }}</td>
                  <td>{{ item.mproduct_name }}</td>
                  <td>{{ item.product_name }}</td>
                  <td>{{ item.product_amt }}</td>
                  <td>{{ item.stock }}</td>
                </tr>
              </tbody>
            </template>
          </template>
        </table>
        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="orderSaveBtn()"
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
  <!-- 모달 끝 -->
</template>

<script>
import { closeModal } from 'jenesius-vue-modal';
export default {
  props: {
    estimate_cd: String,
    client_name: String,
    lproduct_name: String,
    mproduct_name: String,
    product_name: String,
    product_amt: Number,
    stock: Number,
  },
  data() {
    return {
      estlist: [],
      estimateNumList: [],
      estDetaile: '',
      index: 0,
    };
  },
  mounted() {
    this.receiveAction = this.saveModalAction;
    this.estimateDetaile2();
  },
  methods: {
    estimateDetaile2: function () {
      console.log('견적서가 있을 경우 상세조회');
      let params = new URLSearchParams();
      console.log('this.estDetaile) : ' + this.estDetaile);
      params.append('estimate_cd', this.estDetaile);
      //let vm = this;
      this.$vuecombiListAxios('/business/contractDetaile.do', params).then(
        (response) => {
          console.log(
            '견적서있을경우 상세조회 RESPONSE: ' + JSON.stringify(response)
          );
          this.estlist = response.data.contractDetaile;
          console.log('this.estlist : ' + JSON.stringify(this.estlist));
          console.log('client_name : ' + JSON.stringify(this.estlist));
        }
      );
      params.append('contractType', 1);
      this.$vuecombiListAxios('/business/oEManagementListJson.do', params).then(
        (response) => {
          this.estimateNumList = response.data.oEManagementList;
        }
      );
    },

    orderSaveBtn: function () {
      let params = new URLSearchParams();
      console.log('등록버튼을 눌렀을 때!!!');
      if (this.estimateNumList.length == 0) {
        alert('견적서가 존재하지 않습니다.');
      } else if (this.estDetaile == '') {
        alert('견적서를 선택해주세요');
      } else {
        params.append('estimate_cd', this.estDetaile);
        console.log('여기까지 왔다');
        this.$vuecombiListAxios('/business/contractDetaile.do', params).then(
          (response) => {
            let arm = '';

            for (let i in response.data.contractDetaile) {
              if (
                response.data.contractDetaile[i].product_amt >
                response.data.contractDetaile[i].stock
              ) {
                arm +=
                  ',' +
                  response.data.contractDetaile[i].product_name +
                  '의 재고가 모자릅니다.';
              }
            }

            if (arm != '') {
              alert(arm.substring(1));
              return false;
            }
            this.orderSave(response.data.contractDetaile);
          }
        );
      }
    },
    orderSave: function (Object) {
      let vm = this;
      console.log('저장함수 안!!!');
      console.log(JSON.stringify(Object));
      for (let i = 0; i < Object.length; i++) {
        console.log('param 안에 접근' + Object.length);
        let params = new URLSearchParams();
        params.append('estimate_cd', Object[i].estimate_cd);
        params.append('contract_no', Object[i].contract_no);
        params.append('popClient_no', Object[i].client_no);
        params.append('lProduct_no', Object[i].lproduct_cd);
        params.append('midProduct_no', Object[i].mproduct_cd);
        params.append('product_no', Object[i].product_no);
        params.append('productAmtVal', Object[i].product_amt);
        params.append('index', Object.length);
        params.append('price', Object[i].price);
        console.log(params);
        console.log('estimate_cd :' + Object[i].estimate_cd);
        console.log('contract_no :' + Object[i].contract_no);
        console.log('client_no :' + Object[i].client_no);
        console.log('lproduct_cd :' + Object[i].lproduct_cd);
        console.log('mproduct_cd :' + Object[i].mproduct_cd);
        console.log('product_no :' + Object[i].product_no);
        console.log('product_amt :' + Object[i].product_amt);
        console.log('price :' + Object[i].price);
        this.$vuecombiListAxios('/business/contractSave.do', params).then(
          (response) => {
            console.log('저장함수안 RESPONSE : ' + JSON.stringify(response));
            vm.index += parseInt(i) + 1;
            this.src = response.data.contractDetaile;
            console.log(vm.index);
          }
        );
      }
      alert('저장되었습니다.');
      this.close();
    },

    close: function () {
      closeModal();
    },
  },
};
</script>
