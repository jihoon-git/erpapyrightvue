import { createRouter, createWebHashHistory } from "vue-router";
// import App from "../App.vue";
import Home from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import store from "../store/index.js";
//import Content from "../views/Content.vue";

const checkAuthed = function(to, from, next) {
    // console.log(store.state);
    // console.log(to);
    if (store.state.loginInfo == null) {
        alert("로그인이 필요합니다");
        return next("/");
    } else {
        //console.log(to.fullPath);

        let isAuthorized = false;

        try {
            store.state.loginInfo.usrMnuAtrt.forEach(function(item) {
                item.nodeList.forEach(function(item) {
                    if ("/dashboard" + item.mnu_url.replace(".do", "") == to.fullPath) {
                        throw new Error("authorized");
                    }
                });
            });
        } catch (e) {
            isAuthorized = true;
            // console.log('user is authorized for this menu')
        }

        if (isAuthorized || to.fullPath == "/dashboard/home") {
            next();
        } else {
            alert("접근권한이 없습니다");
            next(from.fullPath);
        }
    }
};

const routes = [{
        path: "/dashboard",
        name: "dashboard",
        children: [{
                path: ":type/:menu",
                component: () =>
                    import ("../views/Content.vue"),
            },
            {
                path: "home",
                component: () =>
                    import ("../views/Home.vue"),
            },
        ],
        beforeEnter: (to, from, next) => {
            checkAuthed(to, from, next);
        },

        component: Home,
    },
    {
        path: "/",
        name: "login",
        component: Login,
    },
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
    methods: { checkAuthed },
});

export default router;