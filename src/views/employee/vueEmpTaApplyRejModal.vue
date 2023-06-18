<template>
  <div id="rest_reject" class="layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>반려사유</strong>
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
              <th scope="row">결재자 <span class="font_red"></span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="atd_name"
                  id="atd_name"
                  v-model="atd_name"
                  readonly
                />
              </td>
            </tr>
            <tr height="100">
              <th scope="row">반려사유<span class="font_red"></span></th>
              <td>
                <textarea
                  class="inputTxt p100"
                  name="reject_rsn"
                  id="reject_rsn"
                  v-model="reject_rsn"
                  readonly
                ></textarea>
                <!-- <input type="text" class="inputTxt p100" name="reject_rsn" id="reject_rsn" readonly/> -->
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->
        <div class="btn_areaC mt30">
          <a
            href=""
            @click.prevent="close()"
            class="btnType gray"
            id="btnClose"
            name="btn"
            ><span>닫기</span></a
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

export default {
  props: { Matd_no: Number },
  data: function () {
    return {
      atd_no: '',
      atd_name: '',
      reject_rsn: '',
    };
  },
  mounted: function () {
    this.atd_no = this.Matd_no;
    this.fn_rejectDetail();
  },
  methods: {
    fn_rejectDetail: function () {
      console.log('반려사유 상세보기');
      let vm = this;
      let params = new URLSearchParams();
      params.append('atd_no', vm.atd_no);
      this.$vuecombiListAxios('employee/rest_reject.do', params)
        .then(function (response) {
          //console.log('response : ' + JSON.stringify(response));
          vm.atd_name = response.data.rest_reject.atd_name;
          vm.reject_rsn = response.data.rest_reject.reject_rsn;
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    close: function () {
      closeModal();
    },
  },
};
</script>
