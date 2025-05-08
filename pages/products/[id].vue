<template>
    <v-container class="d-flex justify-center align-center fill-height" fluid>
        <v-card elevation="12" width="650" class="pa-6" max-width="600" outlined>
            <v-btn
                color="secondary"
                class="ma-2"
                prepend-icon="mdi-arrow-left"
                small
                @click="goTo('/products')"
            >
                    Back to Product List
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
        
                    <!-- Product Image -->
                    <v-text-field
                        v-model="product.image"
                        label="Image URL"
                        prepend-icon="mdi-image"
                        :rules="[validateImageRule]"
                        outlined
                        dense
                        required
                        class="my-4"
                        @blur="checkImageValidity"
                        ref="imageField"   
                    />

                    <!-- Product Image Preview -->
                    <v-img
                        v-if="product.image && isImageValid"
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
                </v-form>
            </v-card-text>
    
            <!-- Submit Button -->
            <v-card-actions class="d-flex justify-end">
                <v-btn
                    @click="promptDelete(product.id)"
                    large
                    class="ma-2"
                    color="error"
                    prepend-icon="mdi-trash-can"
                    v-if="!loading"
                >
                    Delete Product
                </v-btn>
                <v-btn
                    @click="editProduct"
                    large
                    class="ma-2"
                    color="success"
                    prepend-icon="mdi-pencil-box"
                    v-if="!loading"
                >
                    Edit Product
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
        @confirm="gotoProduct"
    />

    <v-dialog v-model="confirmDeleteDialog" max-width="400">
    <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
            <v-card-text>Are you sure you want to delete this product?</v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
            <v-btn color="grey" text @click="confirmDeleteDialog = false">Cancel</v-btn>
            <v-btn color="red" text @click="confirmDelete()">Delete</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>


</template>

<script>
import { useProductStore } from '~/stores/product'
import FeedbackDialog from '~/components/FeedbackDialog.vue'
import { mapActions } from 'pinia'
import { useRoute } from 'vue-router'

export default {
    components: {
        FeedbackDialog
    },
    data() {
        return {
            confirmDeleteDialog: false,
            deleteTargetId: null,
            dialog: {
                show: false,
                type: 'success',
                message: '',
            },
            isValid: false,
            loading: false,
            imageFile: null,
            isImageValid: true, 
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
    mounted() {
        const route = useRoute()
        const productId = parseInt(route.params.id)
        this.productStore = useProductStore()

        if (!this.productStore.products.length) {
            this.productStore.fetchProducts().then(() => {
            this.loadProduct(productId)
        })
        } else {
            this.loadProduct(productId)
        }
    },
    methods: {
        goTo(path) {
            this.$router.push(path)
        },

        gotoProduct() {
            this.$router.push('/products')
        },

        ...mapActions(useProductStore, ['addProduct', 'fetchProducts']),

        loadProduct(id) {
            const found = this.productStore.products.find(p => p.id === id)
            if (found) {
                this.product = { ...found } 
            } else {
                this.dialog = {
                show: true,
                type: 'error',
                message: '❌ Product not found.'
                }
            }
        },

        async editProduct() {
            if (this.$refs.form.validate()) {
                this.loading = true
                try {
                    const result = await this.productStore.editProduct(this.product.id, this.product)
                    if (result) {
                        this.dialog = {
                            show: true,
                            type: 'success',
                            message: '✅ Product has been successfully updated.'
                        }
                        this.$nextTick(() => {
                            this.$refs.form.resetValidation()
                        })
                    }    
                } catch (err) {
                    this.dialog = {
                        show: true,
                        type: 'error',
                        message: '❌ Failed to update product.'
                    }
                } finally {
                    this.loading = false
                }
            }
        },

        async promptDelete(id) {
            this.deleteTargetId = id
            this.confirmDeleteDialog = true
        },
        
        async confirmDelete() {
            this.confirmDeleteDialog = false
            try {
                const store = useProductStore()
                await store.deleteProduct(this.deleteTargetId)
                this.dialog = {
                    show: true,
                    type: 'success',
                    message: '✅ Product has been successfully deleted.'
                }
                this.$router.push('/products')
            } catch (err) {
                this.dialog = {
                    show: true,
                    type: 'error',
                    message: '❌ Failed to delete product.'
                }
            }
        },

        checkImageValidity() {
            if (!this.product.image) {
                this.isImageValid = false
                this.imageValidationTriggered = true
                this.$refs.imageField.validate()
                return
            }
            const img = new Image()
            img.onload = () => {
                this.isImageValid = true
                this.imageValidationTriggered = true
                this.$refs.imageField.validate()
            }
            img.onerror = () => {
                this.isImageValid = false
                this.imageValidationTriggered = true
                this.$refs.imageField.validate()
            }
            img.src = this.product.image
        },

        validateImageRule(value) {
            if (!value) return 'Image URL is required'
            if (this.imageValidationTriggered && !this.isImageValid) {
                return 'Image URL is invalid or cannot be loaded'
            }
            return true
        }
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