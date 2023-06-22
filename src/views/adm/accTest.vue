<template>
  <!-- <div>
    <h2>거래처</h2>
    <clientSelectBox
      client_no="client_no"
      selectid="client_no"
      type="all"
      selvalue=""
      eventid="vueBizPartner"
      v-model="client_no"
      @change="bclick"
      ref="Com_combo"
      @send-message="sendmessage"
      style="margin-right: 3px"
    ></clientSelectBox>
    <a class="btnType blue" id="btnSaveDtlCod" name="btn" @click="bclick"
      ><span>저장</span></a
    >
  </div> -->
  <div>
    <h2>계정대분류명</h2>
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
    ></ComCombo>
    <!-- <a class="btnType blue" id="btnSaveDtlCod" name="btn" @click="bclick"
      ><span>저장</span></a
    > -->
  </div>
  <br />
  <div>
    <h2>상세분류명</h2>
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
    ></detileAccount>
  </div>
  <!-- <div>
    <h2>계정과목</h2>
    <productList
      lcategory_cd="lcategory_cd"
      mcategory_cd="mcategory_cd"
      selectid="lcategory_cd"
      type="all"
      selvalue=""
      eventid="vueBizPartner"
      v-model="lcategory_cd"
      @change="bclick"
      ref="Com_combo"
      @send-message="sendmessage"
      style="margin-right: 3px"
    ></productList>
    <a class="btnType blue" id="btnSaveDtlCod" name="btn" @click="bclick"
      ><span>저장</span></a
    >
  </div> -->
</template>
<script>
//import clientSelectBox from '@/components/common/clientSelectBox.vue';
import ComCombo from '@/components/common/ComCombo.vue';
import detileAccount from '@/components/common/detileAccount.vue';
//import productList from '@/components/common/productList.vue';
export default {
  data: function () {
    return {
      group_code: 0,

      client_no: 0,
      clientName: '',
      laccount_cd: '',
      laccountName: '',
      testVal: 0,
      account_cd: '',
      keys: 0,
    };
  },
  components: {
    ComCombo,
    detileAccount,
    //clientSelectBox,
  },
  unmounted() {
    this.emitter.off('ComboEvent');
    this.emitter.off('detailCombo');
  },
  mounted() {
    this.testlist();
  },
  methods: {
    testlist: function () {
      // 본인 메소드 쓰시면 됩니다
    },
    bclick: function () {
      this.emitter.emit('ComboEvent', this.laccount_cd);
      this.account_cd = '';
      this.keys += 1;
    },
    ComboChange: function () {
      this.emitter.emit('detailCombo', this.account_cd);
    },
  },
};
</script>
