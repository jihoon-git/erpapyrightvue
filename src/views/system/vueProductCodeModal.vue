<template>
  <div style="width: 600px" class="layerType2">
    <dl>
      <dt>
        <strong>제품 대분류 등록/수정</strong>
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
              <th scope="row">제품 대분류명 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="modalDetailName"
                  id="detail_name"
                />
              </td>
              <th scope="row">
                제품 대분류코드<span class="font_red">*</span>
              </th>
              <template v-if="saveModalAction == 'I'">
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="modalDetailCode"
                    id="detail_code"
                  />
                </td>
              </template>
              <template v-else>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    v-model="modalDetailCode"
                    id="detail_code"
                    readonly
                  />
                </td>
              </template>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a href="" class="btnType blue" @click.prevent="modalSave()"
            ><span>등록</span></a
          >
          <!-- update 시에만 삭제버튼 -->
          <a
            href=""
            class="btnType blue"
            v-if="receiveAction == 'U'"
            @click.prevent="modalDelete()"
            ><span>삭제</span></a
          >
          <a href="" class="btnType gray" @click.prevent="modalClose()"
            ><span>닫기</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" class="closePop" @click.prevent="modalClose"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';
export default {
  props: {
    //부모창에서 넘어온 action, codedetail
    saveModalAction: String,
    sendDetailCode: String,
  },
  data() {
    return {
      modalDetailName: '',
      modalDetailCode: '',

      //부모창에서 넘어온 action, codedetail
      receiveAction: '',
      receiveDetailCode: '',
    };
  },
  created() {
    this.receiveAction = this.saveModalAction;
    this.receiveDetailCode = this.sendDetailCode;
  },

  mounted() {
    if (this.receiveAction == 'U') {
      this.modalDetail();
    }
  },

  methods: {
    //input 비어있나
    isValidated: function () {
      let chk = this.$checkNotEmpty([
        ['detail_name', '제품 대분류명을 입력해 주세요.'],
        ['detail_code', '제품 대분류코드를 입력해 주세요.'],
      ]);
      return chk;
    },
    //제품 대분류 관리 상세조회
    modalDetail: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('detail_code', this.receiveDetailCode);
      this.$vuecombiListAxios('/system/detailproductcode.do', params).then(
        function (response) {
          vm.modalDetailName = response.data.detailproductcode.detail_name;
          vm.modalDetailCode = response.data.detailproductcode.detail_code;
          vm.receiveAction = 'U';
        }
      );
    },
    //제품 대분류 관리 저장
    modalSave: function () {
      let vm = this;
      let params = new URLSearchParams();
      if (this.isValidated()) {
        //무조건 insert 이후에 update, delete 실행후 에러코드를 통해 중복체크
        if (this.receiveAction == 'I') {
          params.append('action', 'I');
          params.append('detail_name', this.modalDetailName);
          params.append('detail_code', this.modalDetailCode);

          this.$vuecombiListAxios('/system/productcodeinsert.do', params)
            .then(function (response) {
              if (response.data.result == 'FAILNAME') {
                alert(
                  '제품 대분류 명이 중복 되었습니다. \n 확인 후 다시 입력해주세요. '
                );
              } else if (response.data.result == 'FAILCODE') {
                alert(
                  '제품 대분류 코드가 중복 되었습니다. \n 확인 후 다시 입력해주세요.'
                );
              } else {
                alert('저장 되었습니다');
                closeModal(vm);
              }
            })
            .catch((err) => {
              alert(err);
            });
        } else if (this.receiveAction == 'U') {
          params.append('action', 'U');
          params.append('detail_name', this.modalDetailName);
          params.append('detail_code', this.modalDetailCode);

          this.$vuecombiListAxios('/system/productcodeinsert.do', params)
            .then(function (response) {
              if (response.data.result == 'FAILNAME') {
                alert(
                  '제품 대분류 명이 중복 되었습니다. \n 확인 후 다시 입력해주세요. '
                );
              } else {
                alert('수정 되었습니다');
                closeModal(vm);
              }
            })
            .catch((err) => {
              alert(err);
            });
        }
      }
    },
    modalDelete: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('action', 'D');
      params.append('detail_code', vm.modalDetailCode);
      this.$vuecombiListAxios('/system/productcodeinsert.do', params)
        .then(function () {
          alert('삭제되었습니다.');
          closeModal(vm);
        })
        .catch((err) => {
          alert(err);
        });
    },
    /** 닫기 버튼  */
    modalClose: function () {
      let vm = this;
      closeModal(vm);
    },
  },
};
</script>
<style>
.black-bg {
  width: 100%;
  height: 100%;
  background: rgba(201, 204, 22, 0.5);
  position: fixed;
  padding: 20px;
}

.white-bg {
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 8px;
}
</style>
