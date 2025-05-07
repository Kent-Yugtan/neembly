import FeedbackDialog from '~/components/FeedbackDialog.vue'

<template>
    <v-container class="d-flex justify-center align-center fill-height" fluid>
        <v-card elevation="12" width="650" class="pa-6" max-width="600" outlined>
            <v-btn
                color="secondary"
                class="ma-2"
                prepend-icon="mdi-arrow-left"
                small
                @click="goTo('/')"
            >
                    Back to Main Menu
            </v-btn>
    
            <v-card-title
                class="text-h5 font-weight-bold text-center mb-4 d-flex flex-column flex-sm-row align-center justify-center"
                style="white-space: normal; word-break: break-word;"
            >
                <span class="text-h3 mr-sm-2 mb-2 mb-sm-0">🛍️</span>
                <span>Create New Product</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="isValid">
                    <!-- Product Title -->
                    <v-text-field
                        v-model="product.title"
                        label="Product Title"
                        prepend-icon="mdi-tag"
                        :rules="[v => !!v || 'Title is required']"
                        outlined dense
                        required
                    />
        
                    <!-- Product Price -->
                    <v-text-field
                        v-model="product.price"
                        label="Price"
                        type="number"
                        prepend-icon="mdi-currency-usd"
                        :rules="[v => v > 0 || 'Price must be greater than 0']"
                        outlined dense
                        required
                    />
        
                    <!-- Product Description -->
                    <v-textarea
                        v-model="product.description"
                        label="Description"
                        prepend-icon="mdi-text"
                        :rules="[v => !!v || 'Description is required']"
                        outlined dense
                        required
                        rows="4"
                    />
        
                    <!-- Image URL Input -->
                    <v-text-field
                    v-model="product.image"
                    label="Image URL"
                    prepend-icon="mdi-image"
                    :rules="[v => !!v || 'Image URL is required']"
                    outlined
                    dense
                    required
                    class="my-4"
                    />

                    <!-- Image Preview -->
                    <v-img
                    v-if="product.image"
                    :src="product.image"
                    class="my-4"
                    height="200"
                    contain
                    alt="Image Preview"
                    />
        
                    <!-- Category Selection -->
                    <v-select
                        v-model="product.category"
                        :items="categories"
                        label="Category"
                        prepend-icon="mdi-shape"
                        :rules="[v => !!v || 'Category is required']"
                        outlined dense
                        required
                    />
        
                    <!-- Validation Error Message -->
                    <v-alert v-if="!isValid" type="error" dismissible class="mt-4">
                        Please fill out all required fields.
                    </v-alert>
                </v-form>
            </v-card-text>
    
            <!-- Submit Button -->
            <v-card-actions class="d-flex justify-end">
                <v-btn
                    color="primary"
                    @click="submitProduct"
                    :disabled="!isValid"
                    large
                    class="ma-2"
                    v-if="!loading"
                >
                    Submit Product
                </v-btn>
    
                <!-- Loading Spinner -->
                <v-btn
                    color="primary"
                    disabled
                    large
                    class="ma-2"
                    v-if="loading"
                >
                    <v-progress-circular
                    indeterminate
                    color="white"
                    size="30"
                    width="3"
                    class="mr-3"
                    ></v-progress-circular>
                    Submitting...
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
  
    <!-- Success Modal -->
    <FeedbackDialog
        v-model="dialog.show"
        :type="dialog.type"
        :message="dialog.message"
        @confirm="submitProduct"
    />

</template>

<script>
import FeedbackDialog from '~/components/FeedbackDialog.vue'

export default {
    components: {
        FeedbackDialog
    },
    data() {
        return {
            dialog: {
                show: false,
                type: 'success',
                message: '',
            },
            isValid: false,
            loading: false,
            imageFile: null,
            product: {
                title: '',
                price: null,
                description: '',
                image: '',
                category: '',
            },
            categories: [
                "men's clothing",
                "women's clothing",
                "jewelery",
                "electronics",
            ],
        }
    },
    methods: {
        goTo(path) {
            this.$router.push(path)
        },
        async submitProduct() {
            if (this.$refs.form.validate()) {
                this.loading = true
        
                try {
                    const res = await fetch('https://fakestoreapi.com/products', {
                    method: 'POST',
                    body: JSON.stringify(this.product),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    })
                    const result = await res.json()
                    this.loading = false
                    this.dialog = {
                        show: true,
                        type: 'success',
                        message: '✅ Product has been successfully created.',
                    }
                    this.product = {
                        title: '',
                        price: null,
                        description: '',
                        image: '',
                        category: '',
                    }
                } catch (err) {
                    this.dialog = {
                        show: true,
                        type: 'error',
                        message: '❌Failed to create product. Please try again.',
                    }
                    this.loading = false
                }
            }
        },

        closeDialog() {
            this.dialog = false
        },

        goToProductPage() {
            this.$router.push('/products')
            this.closeDialog()
        },
    },
}
</script>

<style scoped>
    .v-container {
        background: linear-gradient(to right, #e0f7fa, #f1f8e9);
        border-radius: 15px;
    }

    .v-card {
        border-radius: 15px;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
    }

    .v-alert {
        margin-top: 16px;
        background-color: #ffebee;
        border: 1px solid #f44336;
        color: #f44336;
    }

    .v-btn:hover {
        background-color: #1976d2 !important;
        color: white !important;
    }
</style>