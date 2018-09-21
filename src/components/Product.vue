<template>
    <div v-if="product != null">
        <button class="btn btn-primary mr-2" @click="goBack">&laquo; Back</button>
        <button class="btn btn-success mr-2" @click="addProductToCart({product: product, quantity: 1})">Add to cart</button>
        <h1>{{ product.name }}</h1>

        <ul class="nav nav-pills">
            <li class="nav-item">
                <router-link class="nav-link" :to="{name:'viewProduct', params: { productId: productId}}" active-class="active">Details</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" :to="{name:'productReviews', params: { productId: productId}}" active-class="active">Reviews</router-link>
            </li>
        </ul>

        <hr>
        <router-view :product="product" @deleteReview="deleteReview" @addNewReview="addNewReview"></router-view>

    </div>
    <div v-else>
        <p>Loadding...</p>
    </div>
</template>

<script>
import * as mutations from "./../mutation-types.js";
import { mapActions } from "vuex";
export default {
    props: {
        productId: {
            required: true
        }
    },
    data() {
        return {
            product: null,
            discount: 0,
            reviewResource: null
        };
    },
    http: {
        headers: {
            "X-CSRF-TOKEN": "VERY_SECURE_TOKEN_HERE"
        }
    },
    created() {
        let customActions = {
            softDelete: {
                method: "DELETE",
                url: "products/{productId}/reviews/{reviewId}?soft=true"
            }
        };

        let url = "products/{productId}/reviews/{reviewId}";
        this.reviewResource = this.$resource(url, {}, customActions);

        this.getProduct(this.productId).then(product => (this.product = product));
    },
    beforeRouteUpdate(to, from, next) {
        this.getProduct(to.params.productId).then(product => (this.product = product));
        next();
    },
    computed: {
        cart() {
            return this.$store.state.cart;
        }
    },
    methods: {
        ...mapActions({ addProductToCart: mutations.ADD_PRODUCT_TO_CART }),
        getCartItem(product) {
            for (let i = 0; i < this.cart.items.length; i++) {
                if (this.cart.items[i].product.id === product.id) {
                    return this.cart.items[i];
                }
            }

            return null;
        },
        getProduct(productId) {
            return this.$http
                .get(`products/{productId}`, {
                    params: {
                        productId: productId
                    }
                })
                .then(resp => resp.json(), () => alert("cold not receive product"));
        },
        goBack() {
            this.$router.go(-1);
        },
        addNewReview(review) {
            this.$http
                .post("products/{productId}/reviews", review, {
                    params: {
                        productId: this.productId
                    }
                })
                .then(resp => resp.json())
                .then(review => {
                    this.product.reviews.push(review);
                });
        },
        async deleteReview(review) {
            await this.reviewResource.softDelete({
                productId: this.productId,
                reviewId: review.id
            });
            this.getProduct(this.productId).then(product => (this.product = product));
        }
    }
};
</script>
