<template>
    <div>
        <div v-if="product.reviews.length > 0">
            <div v-for="(review, index) in product.reviews" :key="index">
                <strong>{{ review.reviewer }}</strong> (rating: {{ review.rating }})
                <a href="#" @click.prevent="$emit('deleteReview', review)">delete</a>
                <p>{{ review.text }}</p>
            </div>
        </div>
        <div v-else>
            <p>No reviews have been added for this product.</p>
        </div>
        <h3>Add Review</h3>
        <form @submit.prevent="$emit('addNewReview',newReview)">
            <div class="form-group">
                <label for="reviewName">Name</label>
                <input type="text" class="form-control" id="reviewName" placeholder="Name" v-model="newReview.reviewer">
            </div>

            <div class="form-group">
                <label for="reviewName">Rating</label>
                <input type="number" class="form-control" id="reviewRating" placeholder="Rating" v-model.number="newReview.rating">
            </div>

            <div class="form-group">
                <label for="reviewText">Text</label>
                <textarea id="reviewText" cols="30" rows="10" class="form-control" v-model="newReview.text"></textarea>
            </div>
            <button class="btn btn-primary">Submit Review</button>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            newReview: {
                reviewer: "",
                rating: 0,
                text: ""
            }
        };
    }
};
</script>