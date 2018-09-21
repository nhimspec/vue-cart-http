<template>
    <div class="card-columns" id="products">
        <div v-for="(product, index) in products" class="card item" :key="index">
            <img @click="clickedImage(product)" class="card-img-top" src="http://placehold.it/400x250/000/fff">
            <div class="card-body">
                <router-link tag="h6" class="card-title" :to="{ name: 'viewProduct', params: { productId: product.id}, hash: '#related'}">
                    <a href="#">{{ product.name }}</a>
                </router-link>

                <p class="card-text">{{ product.description }}</p>
                <br>

                <div class="row flex flex-row align-center">
                    <div class="col-sm-4">
                        <p class="lead">{{ product.price | currency }}</p>
                    </div>

                    <div class="col-sm-8 d-flex flex-row align-items-center justify-content-end">
                        <small class="number-in-stock" :class="{ few: product.inStock < 10 && product.inStock > 0, none: product.inStock == 0 }">
                            {{ product.inStock }} in stock
                        </small>
                        <button class="btn btn-success" @click="addProductToCart(product, 1)" :disabled="product.inStock == 0">Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as actionTypes from "./../mutation-types.js";
export default {
    data() {
        return {
            products: []
        };
    },
    created() {
        this.$http
            .get("products")
            .then(response => response.json(), () => alert("error"))
            .then(products => (this.products = products));
    },
    computed: {
        cart() {
            return this.$store.state.cart;
        }
    },
    methods: {
        getCartItem(product) {
            for (let i = 0; i < this.cart.items.length; i++) {
                if (this.cart.items[i].product.id === product.id) {
                    return this.cart.items[i];
                }
            }

            return null;
        },
        addProductToCart(product, quantity) {
            this.$store
                .dispatch(actionTypes.ADD_PRODUCT_TO_CART, {
                    product: product,
                    quantity: quantity
                })
                .then(() => alert("This product added"));
        },
        clickedImage(product) {
            this.$router.push({
                name: "viewProduct",
                params: {
                    productId: product.id
                },
                query: {
                    discount: 10
                }
            });
        }
    }
};
</script>

<style>
#products .item img {
    background-color: #000;
}
#products .item p.lead {
    margin-bottom: 0;
}
#products .item .number-in-stock {
    margin-right: 10px;
}
#products .item .number-in-stock.few {
    color: #e0a14f;
}
#products .item .number-in-stock.none {
    color: #c45e5e;
}
</style>
