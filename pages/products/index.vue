<template>
  <v-container 
    class="d-flex justify-center align-center fill-height"
    fluid
    style="background: linear-gradient(to right, #f8f9fa, #e0f7fa);"
  >
      <v-card elevation="12" width="1000" class="pa-6" max-width="1200" outlined>
        <v-btn
          color="secondary"
          class="ma-2"
          prepend-icon="mdi-arrow-left"
          small
          @click="goTo('/')"
        >
          Back to Main Menu
        </v-btn>

        <v-row justify="center">
          <v-col cols="12" md="10">
            <h1 class="text-h4 font-weight-bold mb-6 text-center">
              🛍️ Our Featured Products
            </h1>
            <v-divider class="mb-8" />

            <!-- Filter and Search -->
            <v-row class="mb-6" align="center" justify="space-between">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  label="Search products"
                  prepend-icon="mdi-magnify"
                  clearable
                  dense
                  outlined
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  label="Filter by Category"
                  clearable
                  dense
                  outlined
                />
              </v-col>
            </v-row>

            <!-- Loading -->
            <v-row v-if="loading">
              <v-col cols="12">
                <v-progress-linear indeterminate color="primary" />
              </v-col>
            </v-row>

            <!-- Error -->
            <v-alert v-if="error" type="error" class="mb-4">
              {{ error }}
            </v-alert>

            <!-- Product Cards -->
            <v-row v-if="!loading && !error">
              <v-col
                v-for="(product, index) in paginatedProducts"
                :key="`${product.id}-${index}`"
                cols="12"
                sm="6"
                md="4"
                lg="4"
              >
                <v-card class="hover-card" elevation="2" @click="viewProduct(product.id)">
                  <v-img :src="product.image" height="200" cover />
                  <v-card-title class="text-subtitle-1 font-weight-medium">
                    {{ truncate(product.title, 50) }}
                  </v-card-title>
                  <v-card-subtitle class="text-grey-darken-1">
                    ₱{{ product.price }}
                  </v-card-subtitle>
                  <v-card-text class="text-truncate">
                    {{ truncate(product.description, 80) }}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" class="ma-2" @click.stop="viewProduct(product.id)">
                      View Details
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- Pagination -->
          <v-row justify="center" class="mt-6" v-if="!loading && filteredProducts.length > 1">
            <v-col>
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                color="primary"
              />
            </v-col>
          </v-row>

        </v-row>
      </v-card>
    </v-container>
</template>

<script>
import { useProductStore } from '~/stores/product'

export default {
  data() {
    return {
      currentPage: 1,
      perPage: 8,
      loading: true,
      error: null,
      search: '',
      selectedCategory: '',
      categories: ['electronics', 'jewelery', "men's clothing", "women's clothing"]
    }
  },
  computed: {
    productStore() {
      return useProductStore()
    },
    products() {
      return this.productStore.products
    },
    filteredProducts() {
      return this.products.filter(product => {
        const matchesSearch = this.search
          ? product.title.toLowerCase().includes(this.search.toLowerCase())
          : true

        const matchesCategory = this.selectedCategory
          ? product.category === this.selectedCategory
          : true

        return matchesSearch && matchesCategory
      })
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage)
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredProducts.slice(start, start + this.perPage)
    }
  },
  methods: {
    goTo(path) {
      this.$router.push(path)
    },
    viewProduct(id) {
      this.$router.push(`/products/${id}`)
    },
    truncate(text, length) {
      return text.length > length ? text.slice(0, length) + "..." : text
    }
  },
  async mounted() {
    try {
      await this.productStore.fetchProducts()
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }

    // console.log('Products:', this.products)
  }
}
</script>

<style scoped>
.hover-card {
  transition: transform 0.3s, box-shadow 0.3s;
}
.hover-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.v-btn:hover {
  background-color: #1976d2 !important;
  color: white !important;
}
</style>
