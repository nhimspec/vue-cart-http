<template>
    <div>
        <router-view name="discount"></router-view>
        <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3 border-bottom">
            <div class="container">
                <router-link to="/" exact class="navbar-brand">E-commerce Inc.</router-link>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <router-link to="/" tag="li" class="nav-item" exact active-class="active">
                            <a href="#" class="nav-link">Products</a>
                        </router-link>
                        <router-link to="/cart" tag="li" class="nav-item" exact active-class="active">
                            <a href="#" class="nav-link">Cart</a>
                        </router-link>
                    </ul>
                </div>
                <div class="d-inline-block mr-2">
                    <router-link :to="{name:'viewProfile'}">My Profile</router-link>
                    &nbsp;
                    <button v-if="auth.isLoggedIn" class="btn btn-primary" @click="auth.isLoggedIn=false">Logout</button>
                    <button v-else class="btn btn-primary" @click="auth.isLoggedIn=true">Login</button>
                </div>
                <span class="navbar-text">
                    <b>{{ cart.items.length }}</b>
                    <template v-if="cart.items.length < 2"> item</template>
                    <template v-else> items</template> in cart, totalling
                    <b>{{ cartTotal | currency}}</b>
                </span>
            </div>
        </nav>
        <div class="container">
            <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :duration="400" mode="out-in">
                <router-view :cart="cart"></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import CartMixin from "./mixins/CartMixin.js";
import { eventBus, authService } from "./main.js";
export default {
    mixins: [CartMixin],
    data() {
        return {
            cart: {
                items: []
            },
            auth: authService
        };
    },
    created() {
        eventBus.$on("addItemToCart", data => {
            this.addProductToCart(data.product, data.quantity);
        });
    }
};
</script>