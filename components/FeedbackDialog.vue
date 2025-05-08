<template>
  <v-dialog v-model="internalModelValue" max-width="480" persistent transition="dialog-bottom-transition">
    <v-card  class="text-white">
      <v-card-title class="text-h5 font-weight-bold d-flex align-center">
        <v-icon :color="iconColor" size="32" class="mr-3">{{ icon }}</v-icon>
        <span :style="{ color: titleColor }">{{ title }}</span>
      </v-card-title>

      <v-card-text :style="{ color: titleColor }" class="py-4 text-body-1">
        {{ message }}
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn @click="closeDialog" variant="elevated">Close</v-btn>

        <v-btn
          v-if="type === 'success' || type === 'error'"
          :color="buttonColor"
          variant="elevated"
          @click="confirmAndClose"
        >
          OK
        </v-btn>
    </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'StatusDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['success', 'error'].includes(value),
    },
    message: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'confirm'],
  computed: {
    internalModelValue: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
    icon() {
      return this.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
    },
    title(){
      return this.type === 'success' ? 'Success' : "Error"
    },
    iconColor() {
      return this.type === 'success' ? '#2e7d32' : '#c62828' // green / red
    },
    titleColor() {
      return this.type === 'success' ? '#2e7d32' : '#c62828'
    },
    buttonColor() {
      return this.type === 'success' ? 'green' : 'red' // these are Vuetify v3-supported color names
    }

  },
  methods: {
    closeDialog() {
      this.internalModelValue = false
    },
    confirmAndClose() {
      this.$emit('confirm')
      this.$emit('update:modelValue', false)
    },
  },
}
</script>

<style scoped>
  .v-icon {
    vertical-align: middle;
  }
  .v-card {
    border-radius: 12px;
  }
</style>
