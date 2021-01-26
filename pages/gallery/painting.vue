<template>
  <div>
    <CreatePainting />
    <v-data-table
      :headers="headers"
      :items="list"
      :server-items-length="total"
      class="elevation-1"
      :options.sync="listQuery"
    >
      <template #[`item.sold`]="{ item }">
        <v-simple-checkbox
          v-model="item.sold"
          disabled
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import CreatePainting from '~/components/gallery/painting/CreatePainting'

export default {
  name: 'Painting',
  components: { CreatePainting },
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
        { text: 'Price rub', value: 'price_rub' }
      ],
      listQuery: {
        page: 1,
        itemsPerPage: 10,
        sort: ''
      },
      list: [],
      loading: false,
      total: null
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
