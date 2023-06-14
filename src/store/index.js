import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
    state: {
        loginInfo: null,
        isCust: false,
        isScmManager: false,
        isDelvManager: false,
        isExecutive: false,
        isPurcManager: false,
    },
    mutations: {
        logged(state, payload) {
            return (state.loginInfo = payload);
        },
        auth(state, payload) {
            let type = payload.type;
            console.log(type);
            switch (type) {
                case "A":
                    return (state.isScmManager = true);
                case "B":
                    return (state.isDelvManager = true);
                case "C":
                    return (state.isCust = true);
                case "D":
                    return (state.isPurcManager = true);
                case "E":
                    return (state.isExecutive = true);
            }
        },
        logout(state) {
            state.loginInfo = null;
            state.isCust = false;
            state.isScmManager = false;
            state.isDelvManager = false;
            state.isExecutive = false;
            state.isPurcManager = false;
        },
    },
    actions: {},
    modules: {},
    plugins: [createPersistedState()],
});