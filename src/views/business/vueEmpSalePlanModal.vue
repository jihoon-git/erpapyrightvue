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
                  eventid="vue"
                  v-model="client_no"
                  ref="Com_combo"
                  style="margin-right: 3px"
                ></clientSelectBox>
              </td>
            </tr>
            <tr>
              <th scope="row">대분류<span class="font_red">*</span></th>
              <td>
                <select
                  name="newlcategory"
                  id="newlcategory"
                  v-model="newlcategory"
                  @change="newlcategorychange()"
                ></select>
              </td>
              <th scope="row">중분류<span class="font_red">*</span></th>
              <td>
                <select
                  name="newmcategory"
                  id="newmcategory"
                  v-model="newmcategory"
                  @change="newmcategorychange()"
                ></select>
              </td>
            </tr>
            <tr>
              <th scope="row">제품<span class="font_red">*</span></th>
              <td>
                <select
                  name="newproduct"
                  id="newproduct"
                  v-model="newproduct"
                ></select>
              </td>
              <th scope="row">수량<span class="font_red">*</span></th>
              <td>
                <input
                  type="number"
                  class="inputTxt p100"
                  v-model="newnumber"
                  name="newnumber"
                  id="newnumber"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a href="" class="btnType blue" id="btnSave" name="btn"
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
import clientSelectBox from '@/components/common/clientSelectBox.vue';
export default {
  props: {},
  data() {
    return {
      client_no: '', //거래처 콤보박스
    };
  },
  components: {
    clientSelectBox,
  },
  mounted() {},
  methods: {
    close: function () {
      closeModal();
    },
  },
};
</script>
