import Vue from "vue";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import Vuex from "vuex";
import App from "./App.vue";
import routes from "./routes";
import * as mutations from "./mutation-types";

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
Vue.use(Vuex);

Vue.http.options.root = "http://localhost:3000";
Vue.http.headers.common["X-Requested-With"] = "XMLHttpRequest";
Vue.http.interceptors.push((request, next) => {
    request.headers.set("X-CSRF-TOKEN", "VERY_SECURE_TOKEN_HERE");
    next();
});

const store = new Vuex.Store({
    state: {
        cart: {
            items: []
        },
        couponCode: ""
    },
    getters: {
        cartTotal: state => {
            let total = 0;
            state.cart.items.forEach(function(item) {
                total += item.product.price * item.quantity;
            });

            return total;
        },
        taxAmount: (state, getters) => percentage => {
            return (getters.cartTotal * percentage) / 100;
        },
        getCartItem: state => product => {
            for (let i = 0; i < state.cart.items.length; i++) {
                if (state.cart.items[i].product.id === product.id) {
                    return state.cart.items[i];
                }
            }

            return null;
        }
        // taxAmount: (state, getters) => {
        //     return function(percentage) {
        //         return (getters.cartTotal * percentage) / 100;
        //     };
        // }
    },
    actions: {
        [mutations.ADD_PRODUCT_TO_CART]({ commit, getters }, payload) {
            return new Promise(resolve => {
                let cartItem = getters.getCartItem(payload.product);
                payload.cartItem = cartItem;
                if (cartItem == null) {
                    let requestUrl = "http://localhost:3000/cart/add/{productId}/{quantity}";
                    Vue.http
                        .post(
                            requestUrl,
                            {},
                            {
                                params: {
                                    productId: payload.product.id,
                                    quantity: payload.quantity
                                }
                            }
                        )
                        .then(() => {
                            commit(mutations.ADD_PRODUCT_TO_CART, payload);
                            resolve();
                        });
                } else {
                    let requestUrl = "http://localhost:3000/cart/increase-quantity/{productId}";
                    Vue.http
                        .post(
                            requestUrl,
                            {},
                            {
                                params: {
                                    productId: payload.product.id
                                }
                            }
                        )
                        .then(() => {
                            commit(mutations.INCREASE_PRODUCT_QUANTITY, payload);
                            resolve();
                        });
                }
            });
        }
    },
    mutations: {
        [mutations.CHECKOUT](state) {
            state.cart.items.forEach(function(item) {
                item.product.inStock += item.quantity;
            });

            state.cart.items = [];
        },
        [mutations.ADD_PRODUCT_TO_CART](state, payload) {
            state.cart.items.push({
                product: payload.product,
                quantity: payload.quantity
            });

            payload.product.inStock -= payload.quantity;
        },
        [mutations.INCREASE_PRODUCT_QUANTITY](state, payload) {
            payload.cartItem.quantity += payload.quantity;
            payload.product.inStock -= payload.quantity;
        },
        [mutations.UPDATE_COUPON_CODE](state, payload) {
            state.couponCode = payload;
        }
    }
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
    store: store,
    router: router
}).$mount("#app");
