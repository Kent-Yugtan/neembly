import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: []
    }),
    persist: true,
    actions: {
        async fetchProducts() {
            if (this.products.length) return
            const res = await fetch('https://fakestoreapi.com/products')
            if (!res.ok) throw new Error('Failed to fetch products')
            const data = await res.json()
            this.products = data 
        },

        async addProduct(product: any) {
            const res = await fetch('https://fakestoreapi.com/products', {
                method: 'POST',
                body: JSON.stringify(product),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) throw new Error('Failed to create product')

            const newProduct = await res.json()

            this.products.unshift(newProduct)

            return newProduct
        },

        async deleteProduct(id: number) {
            try {
                const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
                    method: 'DELETE'
                })
                if (!res.ok) throw new Error('Failed to delete')
        
                this.products = this.products.filter(p => p.id !== id)
                    return true
                } catch (err) {
                    console.error(err)
                throw err
            }
        },

        async editProduct(id: number, updatedProduct: any) {
            try {
                const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedProduct),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                if (!res.ok) throw new Error('Failed to update product')
        
                const updated = await res.json()
        
                const index = this.products.findIndex(p => p.id === id)
                if (index !== -1) {
                    this.products[index] = updated
                }
        
                return updated
            } catch (err) {
                console.error(err)
                throw err
            }
        }
    }
})
