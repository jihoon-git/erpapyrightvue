import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueSession from "vue-session";
import Paginate from "vuejs-paginate-next";
import VueDaumpostcode from "vue-daum-postcode";

// import twLib from "./assets/js/twLib";



// bootstrap framework 를 Vue에서 사용하기 위해
// boorstrap 에서 뷰 전용 css 를 제공한다.
// 이를 위해서는 기존 bootstrap 라이브러리가 같이 필요하다.
// 권장하는 버전 조합은 v2.22.0(최신) 기준 Bootstrap v4.6.1, Vue.js v2.6.12 이다.
// 현재 package.json 에 설정된 Bootstrap의 버전은
// bootstrap-vue : v2.21.2
// bootstrap : 3.3.x,
// vue.js : v3.2.31 로 현재 개발 환경에서는 스타일 충돌이 발생 할 수 있다.
import "bootstrap-vue/dist/bootstrap-vue.css";
// 일부 충돌 발생
import "bootstrap/dist/css/bootstrap.css";

import "./assets/css/admin/reset.css";
import "./assets/css/admin/basic.css";
import "./assets/css/admin/common.css";
import "./assets/css/admin/layout.css";
// import "./assets/css/jh_css/style.css";

// import Event bus support library
import mitt from "mitt";

// 세션을 이용하기 위해 설정
// vue 의 session 은 서버의 session 과 다르다.
// 독립적인 세션으로서 작동하며 이 세션을 통해 서버의 세션값을 가져올 수 있는 것이 아니다.
// 서버의 세션은 오로지 요청에 의해서만 서버에서 반환받아 사용할 수 있다.
var sessionOptions = {
    persist: true,
};

// 실제 데이터를 json으로 주고받기 위해 무언가 요청할 때 사용할 수 있도록 설정
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

const app = createApp(App);
const emitter = mitt();

// Declare globalProperties
// app에 통신할 때 axios 쓸 거야 선언
app.config.globalProperties.axios = axios;
app.config.productionTip = false;
// set globalProperties "emitter" that mitt Object ref-variable
app.config.globalProperties.emitter = emitter;





// store, router, vueSession, sessionOptions 사용할 거야
// 네 개 다 사용해서 app을 띄워

app
    .use(store)
    .use(router)
    .use(VueSession, sessionOptions)
    .use(Paginate)
    //.use(twLib)
    .use(emitter)
    .use(VueDaumpostcode)
    .mount("#app");



// main.js
// - 제일 먼저 실행되는 js
// - 프로젝트에서 필요한 게 있으면 main.js에서 공통적으로 사용할 수 있도록 import 해 주면 됨
// - jsp 방식에서의 common_include.jsp file 과 동일한 기능이라 볼 수 있다.