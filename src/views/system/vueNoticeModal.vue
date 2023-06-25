<template>
  <div class="layerType2" style="width: 600px">
    <form id="myForm">
      <dl>
        <dt>
          <strong>공지사항 등록/수정</strong>
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
                <th scope="row">작성자 <span class="font_red">*</span></th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="writerfile"
                    v-model="writerfile"
                    readonly
                  />
                </td>
                <th scope="row">작성일자 <span class="font_red">*</span></th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="notice_datefile"
                    v-model="notice_datefile"
                    readonly
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">제목 <span class="font_red">*</span></th>
                <td colspan="3">
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="notice_titlefile"
                    id="notice_titlefile"
                    v-model="notice_titlefile"
                  />
                </td>
              </tr>

              <tr>
                <th scope="row">내용 <span class="font_red">*</span></th>
                <td colspan="3">
                  <textarea
                    class="inputTxt p100"
                    name="notice_detfile"
                    id="notice_detfile"
                    v-model="notice_detfile"
                  >
                  </textarea>
                </td>
              </tr>

              <tr>
                <th scope="row">파일 <span class="font_red">*</span></th>
                <td>
                  <!-- input type="file" class="inputTxt p100" name="addfile" id="addfile"  onChange="fn_filechange(event)"  / -->
                  <input
                    type="file"
                    class="inputTxt p100"
                    name="addfile"
                    v-if="this.noticeUserType == 'A'"
                    @change="onFileChange"
                  />
                </td>
                <td colspan="2">
                  <div v-html="fileview" @click="fileclick"></div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- e : 여기에 내용입력 -->

          <div class="btn_areaC mt30">
            <template v-if="noticeUserType == 'A'">
              <a href="" class="btnType blue" @click.prevent="btnSavefile"
                ><span>저장</span></a
              >
              <a
                href=""
                class="btnType blue"
                v-if="this.action == 'U'"
                @click.prevent="btnDeletefile(this.notice_no)"
                ><span>삭제</span></a
              >
              <a
                href=""
                @click.prevent="btnClose"
                class="btnType gray"
                id="btnClosefile"
                ><span>닫기</span></a
              >
            </template>
            <template v-else>
              <a
                href=""
                @click.prevent="btnClose"
                class="btnType gray"
                id="btnClosefile"
                ><span>닫기</span></a
              >
            </template>
          </div>
        </dd>
      </dl>
      <a href="" class="closePop" @click.prevent="btnClose"
        ><span class="hidden">닫기</span></a
      >
    </form>
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: { receiveObject: Object, receiveAction: String },
  data: function () {
    return {
      noticeUserType: '',

      //props로 받은값
      action: '',
      noticeObject: {},

      notice_no: '',
      writerfile: '',
      notice_datefile: '',
      notice_titlefile: '',
      notice_detfile: '',
      fileview: '',

      filename: '',
      filephy: '',
    };
  },
  created() {
    this.noticeObject = this.receiveObject;
    this.action = this.receiveAction;

    //유저타입
    this.noticeUserType = this.$store.state.loginInfo.userType;

    if (this.action == 'U') {
      this.notice_no = this.noticeObject.notice_no;
    }
  },
  mounted() {
    if (this.receiveAction == 'I') {
      //초기화
      this.notice_no = '';
      this.notice_titlefile = '';
      this.notice_detfile = '';

      //등록시 바로 보이게
      this.writerfile = this.noticeObject.writer;
      this.notice_datefile = this.noticeObject.today;
    } else {
      this.fn_detailone();
    }
  },
  methods: {
    onFileChange: function (e) {
      var files = e.target.files;
      var fileType = files[0].type;
      if (
        fileType == 'image/png' ||
        fileType == 'image/jpg' ||
        fileType == 'image/jpeg' ||
        fileType == 'image/bmp'
      ) {
        this.fileview =
          "<img style='width:200px; height:130px' src='" +
          window.URL.createObjectURL(e.target.files[0]) +
          "' />";
      }
    },
    //파일을 클리하면 다운로드
    fileclick: function () {
      let vm = this;

      let params = new URLSearchParams();
      // params.append('file_madd', this.filephy);
      // params.append('file_name', this.filename);
      params.append('notice_no', this.noticeObject.notice_no);
      this.$vuecombiListAxios('/system/noticefiledownaload.do', params).then(
        (res) => {
          if (res.status == 200) {
            var FILE = window.URL.createObjectURL(new Blob([res.data]));
            var docUrl = document.createElement('a');
            docUrl.href = FILE;
            docUrl.setAttribute('download', vm.filename);
            document.body.appendChild(docUrl);
            docUrl.click();
          }
        }
      );
    },
    //input 비어있나
    isValidated: function () {
      let chk = this.$checkNotEmpty([
        ['notice_titlefile', '공지사항의 제목을 입력해 주세요.'],
        ['notice_detfile', '공지사항의 내용을 입력해 주세요.'],
      ]);
      return chk;
    },
    //상세조회 클릭시
    fn_detailone: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('notice_no', this.noticeObject.notice_no);
      this.$vuecombiListAxios('/system/vueNoticeDetailone.do', params).then(
        function (response) {
          vm.notice_no = response.data.detailone.notice_no;
          vm.writerfile = response.data.detailone.writer;
          vm.notice_datefile = response.data.detailone.notice_date;
          vm.notice_titlefile = response.data.detailone.notice_title;
          vm.notice_detfile = response.data.detailone.notice_det;

          //vm.imgSrc = res.data.boardinfo.file_nadd;
          let file_name = response.data.detailone.file_name;

          vm.filename = response.data.detailone.file_name;
          vm.filephy = response.data.detailone.file_madd;

          //file_name 이 있으면
          if (file_name) {
            let file_namearr = file_name.split('.');
            if (
              file_namearr[1] == 'png' ||
              file_namearr[1] == 'jpg' ||
              file_namearr[1] == 'jpeg' ||
              file_namearr[1] == 'bmp'
            ) {
              vm.fileview =
                "<img src='" +
                response.data.detailone.file_nadd +
                "' style ='width: 200px; height: 130px;' />";
            } else {
              vm.fileview = response.data.detailone.file_name;
            }
          }
        }
      );
    },
    btnSavefile: function () {
      //let vm = this;
      let formData = new FormData(document.getElementById('myForm'));
      formData.enctype = 'multipart/form-data';
      if (this.isValidated()) {
        if (this.receiveAction == 'I') {
          formData.append('action', 'I');
          formData.append('loginID', this.$store.state.loginInfo.loginId);
          formData.append('writerfile', this.writerfile);
          formData.append('notice_titlefile', this.notice_titlefile);
          formData.append('notice_detfile', this.notice_detfile);

          alert('저장 되었습니다.');
          closeModal();
        } else if (this.receiveAction == 'U') {
          formData.append('action', 'U');

          formData.append('noticeno', this.notice_no);
          formData.append('loginID', this.$store.state.loginInfo.loginId);
          formData.append('writerfile', this.writerfile);
          formData.append('notice_titlefile', this.notice_titlefile);
          formData.append('notice_detfile', this.notice_detfile);

          alert('수정 되었습니다.');
          closeModal();
        }
      }
      this.$vuecombiListAxios('/system/noticesavefile.do', formData)
        .then()
        .catch((err) => {
          alert(err);
        });
    },
    btnDeletefile: function (notice_no) {
      //let vm = this;
      let params = new URLSearchParams();
      params.append('noticeno', notice_no);
      params.append('action', 'D');
      this.$vuecombiListAxios('/system/noticesavefile.do', params).then();
      alert('삭제 되었습니다');
      closeModal();
    },

    btnClose: function () {
      closeModal();
    },
  },
};
</script>
