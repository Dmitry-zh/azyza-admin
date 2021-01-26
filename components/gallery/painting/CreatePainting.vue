<template>
  <v-row justify="center">
    <v-dialog
      v-model="isShown"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="closeModal"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="handleSubmit"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form ref="form" v-model="form.valid">
          <v-container>
            <v-row>
              <v-text-field
                v-model="form.title"
                :rules="form.required"
                label="Title"
                name="title"
                required
              />
            </v-row>
            <v-row>
              <v-text-field
                v-model="form.description"
                :rules="form.required"
                label="Description"
                name="description"
                required
              />
            </v-row>
            <v-row>
              <v-text-field
                v-model.number="form.price_rub"
                :rules="form.required"
                label="Price rub"
                name="price_rub"
                required
                @change="dividePrice(form.price_rub, 'price_rub')"
              />
            </v-row>
            <v-row>
              <v-checkbox
                v-model="form.sold"
                label="Sold"
              />
            </v-row>
            <v-file-input
              v-model="form.image"
              accept="image/*"
              label="Image"
              :rules="form.required"
              required
              @change="handleChangeImageInput"
            />
            <v-img
              v-if="form.image"
              max-height="250"
              max-width="250"
              :src="previewSRC"
            />
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'CreatePainting',
  data () {
    return {
      isShown: false,
      notifications: false,
      sound: true,
      widgets: false,
      previewSRC: '',
      form: {
        valid: false,
        title: '',
        description: '',
        sold: false,
        price_rub: '',
        image: null,
        required: [
          v => !!v || 'Required field'
        ]
      }
    }
  },
  methods: {
    clearImagePreview () {
      this.previewSRC = ''
    },
    closeModal () {
      this.isShown = false
    },
    dividePrice (number, field) {
      const dividedNumber = String(number).replace(/[^0-9.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      this.form[field] = dividedNumber
      return dividedNumber
    },
    formRequestBody () {
      const formData = new FormData()
      formData.append('image', this.form.image)
      formData.append('title', this.form.title)
      formData.append('description', this.form.description)
      formData.append('sold', this.form.sold)
      formData.append('price_rub', this.formatPrice(this.form.price_rub))

      return formData
    },
    formatPrice (price) {
      return parseInt(price.split(' ').join(''))
    },
    handleChangeImageInput () {
      if (this.form.image) {
        this.setImagePreview()
      } else {
        this.clearImagePreview()
      }
    },
    handleSubmit () {
      this.validateForm()
      if (this.form.valid) {
        const reqBody = this.formRequestBody()
        return this.$store.dispatch('client/postEntity', { endpoint: this.$route.path, reqBody, headers: { 'Content-Type': 'multipart/form-data' } })
      }
    },
    setImagePreview () {
      if (/\.(jpe?g|png|gif)$/i.test(this.form.image.name)) {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          this.previewSRC = reader.result
        }, false)
        reader.readAsDataURL(this.form.image)
      }
    },
    validateForm () {
      this.$refs.form.validate()
    }
  }
}
</script>

<style scoped>

</style>
