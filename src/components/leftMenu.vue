<template>
  <h3 class="hidden">lnb 영역</h3>
  <div id="lnb_area">
    <div class="logo">
      <div id="header">
        <router-link :to="'/dashboard/home'">
          <a class="logo">
            <img id="logoImg" src="../assets/images/admin/login/logo_img.png" />
          </a>
        </router-link>
      </div>
    </div>
    <div class="login">
      <!-- template if you logged -->
      <template v-if="loginInfo.loginId">
        <img
          src="../assets/images/admin/comm/left_myImg.jpg"
          class="LoginImg"
          alt="사진"
        />
        <span class="LoginName">{{ loginInfo.loginId }}</span>
        <div class="btn_loginArea">
          <a class="logout" @click="logoutproc()" name="modal"
            ><span>LOGOUT</span></a
          >
        </div>
      </template>
    </div>

    <ul class="lnbMenu">
      <template v-for="(list, index) in loginInfo.menulist" :key="list.mnu_id">
        <li>
          <dl>
            <!-- 대분류 메뉴 -->
            <dt>
              <a
                class="lnbBtn menu005"
                :class="list.isShow == true ? 'on' : ''"
                href="#"
                @click="slideDown(index, $event)"
                >{{ list.mnu_nm }}
              </a>
            </dt>

            <!-- 소분류 메뉴 -->
            <slide v-model="list.isShow" :duration="400">
              <dd>
                <template v-for="i in list.nodeList" :key="i.mnu_id">
                  <!-- <a @click="menulink(i.mnu_url)">- {{i.mnu_nm}}</a> -->
                  <router-link :to="'/dashboard' + i.mnu_url.replace('.do', '')"
                    >- {{ i.mnu_nm }}</router-link
                  >
                </template>
              </dd>
            </slide>
          </dl>
        </li>
      </template>
    </ul>

    <div style="clear: both"></div>
  </div>
</template>

<script>
import SlideUpDown from "vue3-slide-up-down";
// import Dashboard from "@/views/Dashboard.vue";

export default {
  name: "leftMenu",
  components: { slide: SlideUpDown },
  data: function () {
    return {
      loginInfo: {
        menulist: [],
        loginId: "",
      },
    };
  },
  mounted: function () {
    let loginInfo = this.$store.state.loginInfo;
    loginInfo.usrMnuAtrt.forEach((item) => {
      item.isShow = false;
    });
    this.loginInfo.menulist = loginInfo.usrMnuAtrt;
    this.loginInfo.loginId = loginInfo.loginId;
  },
  methods: {
    logoutproc: function () {
      this.$store.commit("logout");

      this.axios
        .post("/loginOut.do")
        .then((resp) => {
          let data = resp.data;
          console.log(data.msg);
          alert("LogOut 되어ㅆ습니다.");
          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
          alert("API 요청에 오류가 있습니다");
        });
    },
    /* menulink:function(path){
            let patharr=path.split('/');
            let type=patharr[1];
            let menu=patharr[2].replace('.do','');
            //  this.$router.push({path:'/dashboard'+path.replace('.do',''),params:{type:type,menu:menu}})
            this.$router.push('/dashboard/'+type+'/'+menu);
        }, */
    setlist: function (list) {
      this.menulist = list;
    },
    slideDown: function (index, event) {
      // prevent a tag Default event
      event.preventDefault();
      // slide down chosen menu list
      this.loginInfo.menulist[index].isShow =
        !this.loginInfo.menulist[index].isShow;

      // slideUp exept choose one
      for (let i = 0; i < this.loginInfo.menulist.length; i++) {
        if (i != index) {
          this.loginInfo.menulist[i].isShow = false;
        }
      }
    },
  },
};
</script>

<style>
#logoImg {
  cursor: pointer;
}
ul.lnbMenu {
  padding-left: 0;
}
ul dl {
  margin: 0;
  padding: 0;
}
ul dl a {
  text-decoration: none;
  color: #666;
  cursor: pointer;
  font-weight: normal;
}
ul dl a:hover,
ul dl a:focus {
  text-decoration: none;
  color: #666;
}
ul dl a.on:focus {
  color: #fff;
}
</style>
