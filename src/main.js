import Vue from "vue";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import App from "./App.vue";
import routes from "./routes";

// Css
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";

Vue.config.productionTip = false;

Vue.filter("currency", function(val) {
    let formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0
    });

    return formatter.format(val);
});

export const eventBus = new Vue();
export const authService = { isLoggedIn: false };

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.options.root = "http://localhost:3000";
Vue.http.headers.common["X-Requested-With"] = "XMLHttpRequest";
Vue.http.interceptors.push((request, next) => {
    request.headers.set("X-CSRF-TOKEN", "VERY_SECURE_TOKEN_HERE");
    next(resp => {
        console.log(resp);
    });
});

const router = new VueRouter({
    routes: routes,
    mode: "history",
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            };
        }

        if (savedPosition) {
            return savedPosition;
        }

        return { x: 0, y: 0 };
    }
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.isAuthRequired)) {
        if (!authService.isLoggedIn) {
            alert("You must be logged in!!");
            return next(false);
        }
    }

    next();
});

new Vue({
    render: h => h(App),
    router: router
}).$mount("#app");
