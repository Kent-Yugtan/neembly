import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (!nuxtApp.$pinia) {
    console.error('[PiniaPersist] $pinia not found')
    return
  }
  nuxtApp.$pinia.use(piniaPluginPersistedstate)
})
