<template>
    <v-container
        fluid
        class="fill-height d-flex align-center justify-center"
        style="background: linear-gradient(to right, #f8f9fa, #e0f7fa);"
    >
    <v-row class="w-100" justify="center">
        
            <v-col
                cols="12"
                sm="10"
                md="8"
                lg="6"
                xl="4"
            >
                <v-card elevation="12" class="pa-6">
                    <v-card-title
                        class="text-h5 font-weight-bold text-center mb-4 d-flex flex-column flex-sm-row align-center justify-center"
                        style="white-space: normal; word-break: break-word;"
                    >
                        <span class="text-h3 mr-sm-2 mb-2 mb-sm-0">🛍️</span>
                        <span>Product Manager</span>
                    </v-card-title>

                    <v-card-subtitle 
                        class="text-center mb-6"
                        style="white-space: normal; word-break: break-word;"
                    >
                        Manage your product inventory with ease. Choose an option below to get started.
                    </v-card-subtitle>

                    <v-card-actions
                        class="d-flex flex-column flex-sm-row justify-center align-center"
                    >
                        <v-btn
                            color="success"
                            class="ma-2"
                            prepend-icon="mdi-plus-box"
                            large
                            @click="goTo('/create')"
                        >
                            Create Product
                        </v-btn>

                        <v-btn
                            color="primary"
                            class="ma-2"
                            prepend-icon="mdi-view-grid"
                            large
                            @click="goTo('/products')"
                        >
                            View Products
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    methods: {
        goTo(path) {
            this.$router.push(path)
        }
    }
}
</script>

<style scoped>
    .v-btn:hover {
        background-color: #1976d2 !important;
        color: white !important;
    }
</style>