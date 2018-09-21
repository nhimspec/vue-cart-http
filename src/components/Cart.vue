<template>
    <div>
        <h1>Cart</h1>

        <table v-if="cart.items.length > 0" class="table table-striped">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in cart.items" :key="index">
                    <td>{{ item.product.name }}</td>
                    <td>
                        {{ item.quantity }} &nbsp;
                        <button class="btn btn-sm btn-success" @click="increaseQuantity(item)" :disabled="item.product.inStock == 0">+</button>&nbsp;
                        <button class="btn btn-sm btn-danger" @click="decreaseQuantity(item)">-</button>
                    </td>
                    <td>{{ item.quantity * item.product.price | currency }}</td>
                </tr>

                <tr>
                    <td class="text-right" colspan="2">
                        <strong>Subtotal</strong>
                    </td>

                    <td>{{ cartTotal | currency }}</td>
                </tr>

                <tr>
                    <td class="text-right" colspan="2">
                        <strong>Taxes</strong>
                    </td>

                    <td>{{ taxAmount(10) | currency }}</td>
                </tr>

                <tr>
                    <td class="text-right" colspan="2">
                        <strong>Coupon code</strong>
                    </td>

                    <td><input type="text" class="form-control" placeholder="Enter coupon code here" v-model="couponCode"></td>
                </tr>

                <tr>
                    <td class="text-right" colspan="2">
                        <strong>Grand total</strong>
                    </td>

                    <td>{{ cartTotal + taxAmount(10) | currency }}</td>
                </tr>

                <tr>
                    <td class="text-right" colspan="2">
                        <span v-if="couponCode">
                            <em>Lucky you! You entered the following coupon code: {{ couponCode }}</em>
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-success" @click="checkout">Checkout</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-else>Your cart is currently empty.</p>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import * as mutations from "./../mutation-types.js";
export default {
    computed: {
        ...mapGetters(["cartTotal", "taxAmount"]),
        cart() {
            return this.$store.state.cart;
        },
        couponCode: {
            get() {
                return this.$store.state.couponCode;
            },
            set(value) {
                this.$store.commit(mutations.UPDATE_COUPON_CODE, value);
            }
        }
    },
    methods: {
        increaseQuantity(cartItem) {
            cartItem.product.inStock--;
            cartItem.quantity++;
        },

        decreaseQuantity(cartItem) {
            cartItem.quantity--;
            cartItem.product.inStock++;

            if (cartItem.quantity == 0) {
                this.removeItemFromCart(cartItem);
            }
        },

        removeItemFromCart(cartItem) {
            let index = this.cart.items.indexOf(cartItem);

            if (index !== -1) {
                this.cart.items.splice(index, 1);
            }
        },
        ...mapMutations({ checkout: mutations.CHECKOUT })
    },
    beforeRouteLeave(to, from, next) {
        if (this.cart.items.length > 0) {
            if (!confirm("Are you sure you don't want to buy these products?")) {
                return next(false);
            }
        }
        next();
    }
};
</script>
<style scoped>
table tbody tr td .btn-sm {
    width: 30px;
}
</style>
