<template>
  <div>
    <h2>제품대분류</h2>
    <ProLComCombo
      group_code="lcategory_cd"
      selectid="lcategory_cd"
      type="all"
      selvalue=""
      eventid="ProLCombo"
      resetid="ResetEvent"
      v-model="lcategory_cd"
      @change="ProLclick"
      ref="Com_combo"
      style="margin-right: 3px"
    ></ProLComCombo>
  </div>
  <div>
    <h2>제품중분류</h2>
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
    ></ProMCombo>
    <a class="btnType blue" id="btnSaveDtlCod" name="btn" @click="ProMclick"
      ><span>저장</span></a
    >
  </div>
  <div>
    <h2>제품소분류</h2>
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
    ></ProSCombo>
    <a class="btnType blue" id="btnSaveDtlCod" name="btn" @click="ProSclick"
      ><span>저장</span></a
    >
    <a class="btnType blue" id="btnSaveDtlCod" name="btn" @click="searchBtn"
      ><span>검색</span></a
    >
  </div>
</template>
<script>
import ProLComCombo from '@/components/common/ProLComCombo.vue';
import ProMCombo from '@/components/common/ProMCombo.vue';
import ProSCombo from '@/components/common/ProSCombo.vue';
export default {
  data: function () {
    return {
      group_code: 0,
      client_no: 0,
      clientName: '',
      laccount_cd: '',
      account_name: '',
      lcategory_cd: '',
      mcategory_cd: '',
      product_no: '',
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
    this.emitter.off('ResetEvent');
  },
  mounted() {
    this.testlist();
  },
  methods: {
    searchBtn: function () {
      //검색버튼 눌렀을 때 리셋해주세요
      this.testlist();
      this.emitter.emit('ResetEvent', '');
    },
    testlist: function () {
      console.log('시작은 여기야 !!!!!');
    },
    ProLclick: function () {
      this.emitter.emit('ProLCombo', this.lcategory_cd);
    },
    ProMclick: function () {
      this.emitter.emit('ProMCombo', this.mcategory_cd);
    },

    ProSclick: function () {
      this.emitter.emit('ProSCombo', this.product_no);
    },
  },
};
</script>
