import ProductList from "./components/ProductList.vue";
import Cart from "./components/Cart.vue";
import ViewProduct from "./components/ViewProduct.vue";
import Product from "./components/Product.vue";
import ProductReviews from "./components/ProductReviews.vue";
import SpecialOffer from "./components/SpecialOffer.vue";
import ViewProfile from "./components/ViewProfile.vue";
import Page404 from "./components/Page404.vue";

export default [
    {
        path: "",
        components: {
            default: ProductList,
            discount: SpecialOffer
        }
    },
    { path: "/cart", component: Cart },
    {
        path: "/products/:productId",
        props: true,
        component: Product,
        children: [
            { path: "detail", name: "viewProduct", props: true, component: ViewProduct },
            { path: "reviews", name: "productReviews", props: true, component: ProductReviews }
        ]
    },
    {
        path: "/profile",
        name: "viewProfile",
        component: ViewProfile,
        meta: {
            isAuthRequired: true
        }
    },
    { path: "*", component: Page404 }
];
