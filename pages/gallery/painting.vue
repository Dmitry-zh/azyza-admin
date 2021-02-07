<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="list"
      :server-items-length="total"
      class="elevation-1"
      :options.sync="listQuery"
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>PAINTING</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <edit-painting :dialog="isEditing" :editing-item-id="idOfEditingItem" @viewChanged="changeEditView" />
        </v-toolbar>
      </template>
      <template #[`item.sold`]="{ item }">
        <v-simple-checkbox
          v-model="item.sold"
          disabled
        />
      </template>
      <template #[`item.img_id`]="{ item }">
        <v-img
          :lazy-src="getImageURL(item.img_id)"
          max-height="125"
          max-width="125"
          contain
          :src="getImageURL(item.img_id)"
        />
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item.id)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import EditPainting from '~/components/gallery/painting/EditPainting'
import { getImageURL } from '~/helpers'

export default {
  name: 'Painting',
  components: { EditPainting },
  data () {
    return {
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id'
        },
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'Sold', value: 'sold' },
        { text: 'Price rub', value: 'price_rub' },
        { text: 'Image', value: 'img_id' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      listQuery: {
        page: 1,
        itemsPerPage: 10,
        sort: ''
      },
      isEditing: false,
      list: [],
      loading: false,
      total: null,
      idOfEditingItem: null,
      getImageURL
    }
  },
  watch: {
    listQuery: {
      handler () {
        this.fetchList()
      },
      deep: true
    }
  },
  beforeMount () {
    this.fetchList()
  },
  methods: {
    changeEditView (bool) {
      this.isEditing = bool
      if (!bool) {
        this.clearItemToEdit()
      }
    },
    clearItemToEdit () {
      this.idOfEditingItem = null
    },
    editItem (id) {
      this.idOfEditingItem = id
      this.isEditing = true
    },
    fetchList () {
      this.setLoading(true)
      this.$store.dispatch('client/fetchList', { endpoint: this.$route.path, params: this.listQuery })
        .then((r) => {
          if (r.status === 200) {
            this.list = r.data.rows
            this.total = r.data.count
          }
        })
        .catch(e => console.error(e.message))
        .finally(() => {
          this.setLoading(false)
        })
    },
    setLoading (bool) {
      this.loading = bool
    }
  }
}
</script>
