<template>
  <v-dialog
    v-model="isShown"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        dark
        v-bind="attrs"
        v-on="on"
      >
        Create
      </v-btn>
    </template>
    <v-card :loading="fetching">
      <v-toolbar
        dark
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
            :disabled="fetching"
            @click="handleSubmit"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form ref="form" v-model="form.valid" :disabled="fetching">
        <v-container>
          <v-row>
            <v-text-field
              v-model="form.title"
              :rules="validations.required"
              label="Title"
              name="title"
              required
            />
          </v-row>
          <v-row>
            <v-text-field
              v-model="form.description"
              :rules="validations.required"
              label="Description"
              name="description"
              required
            />
          </v-row>
          <v-row>
            <v-text-field
              v-model.number="form.price_rub"
              :rules="validations.required"
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
            :rules="validations.imgRequired"
            required
            @change="handleChangeImageInput"
          />
          <v-img
            v-if="form.img_id && !form.image"
            max-height="250"
            max-width="250"
            :src="getImageURL(form.img_id)"
          />
          <v-img
            v-else-if="form.image"
            max-height="250"
            max-width="250"
            :src="previewSRC"
          />
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { getImageURL } from '~/helpers'

export default {
  name: 'EditPainting',
  props: {
    dialog: {
      type: Boolean,
      required: false,
      default: false
    },
    editingItemId: {
      type: Number,
      required: false,
      default: null
    }
  },
  data () {
    return {
      isShown: false,
      fetching: false,
      notifications: false,
      previewSRC: '',
      defaultFormProps: {
        valid: false,
        title: '',
        description: '',
        sold: false,
        price_rub: '',
        image: null
      },
      form: {
        valid: false,
        title: '',
        description: '',
        sold: false,
        price_rub: '',
        image: null
      },
      validations: {
        required: [
          v => !!v || 'Required field'
        ],
        imgRequired: [
          v => (!!v || !!this.form.img_id) || 'Required img'
        ]
      },
      getImageURL
    }
  },
  watch: {
    dialog (val) {
      val ? this.processOpening() : this.closeModal()
    },
    isShown (val) {
      val && this.processOpening()
    }
  },
  methods: {
    clearImagePreview () {
      this.previewSRC = ''
    },
    closeModal () {
      this.$emit('viewChanged', false)
      this.isShown = false
    },
    createEntity (reqBody) {
      return this.$store.dispatch('client/createEntity', { endpoint: this.$route.path, reqBody, headers: { 'Content-Type': 'multipart/form-data' } })
    },
    dividePrice (number, field) {
      const dividedNumber = String(number).replace(/[^0-9.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      this.form[field] = dividedNumber
      return dividedNumber
    },
    async fetchItem (id) {
      this.fetching = true
      await this.$store.dispatch('client/fetchOne', { endpoint: this.$route.path, id }).then((r) => {
        if (r?.data && r?.status === 200) {
          this.setItemFromProps(r.data)
        }
      })
        .catch(e => e).finally(() => {
          this.fetching = false
        })
    },
    formRequestBody () {
      const formData = new FormData()
      if (this.form.image) {
        formData.append('image', this.form.image)
      } else {
        formData.append('img_id', this.form.img_id)
        formData.append('minimal_img_id', this.form.minimal_img_id)
      }
      this.form.id && formData.append('id', this.form.id)
      formData.append('title', this.form.title)
      formData.append('description', this.form.description)
      formData.append('sold', this.form.sold)
      formData.append('price_rub', this.formatPrice(this.form.price_rub))

      return formData
    },
    formatPrice (price) {
      return parseInt(String(price).split(' ').join(''))
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
        this.form.id ? this.updateEntity(reqBody) : this.createEntity(reqBody)
      }
    },
    openModal () {
      this.isShown = true
    },
    processOpening () {
      this.openModal()
      this.$nextTick(() => {
        this.editingItemId ? this.fetchItem(this.editingItemId) : this.setItemFromProps()
      })
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
    setItemFromProps (editableItem) {
      if (editableItem?.id) {
        this.form = Object.assign({}, this.defaultFormProps, editableItem)
        this.$refs.form.resetValidation()
      } else {
        this.form = Object.assign({}, this.defaultFormProps)
      }
    },
    updateEntity (reqBody) {
      return this.$store.dispatch('client/updateEntity', { endpoint: this.$route.path, reqBody, headers: { 'Content-Type': 'multipart/form-data' } })
    },
    validateForm () {
      this.$refs.form.validate()
    }
  }
}
</script>

<style scoped>

</style>
