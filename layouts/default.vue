<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-treeview
          hoverable
          open-on-click
          transition
          :items="tree"
          open-all
        >
          <template #prepend="{ item }">
            <v-icon v-if="item.icon">
              {{ item.icon }}
            </v-icon>
          </template>
          <template #label="{item}">
            <v-list-item
              :to="item.to"
              router
              exact
            >
              {{ item.name }}
            </v-list-item>
          </template>
        </v-treeview>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      tree: [
        {
          id: 1,
          icon: 'mdi-view-dashboard',
          name: 'Dashboard',
          to: '/'
        },
        {
          id: 2,
          name: 'Gallery',
          icon: 'mdi-folder-image',
          children: [
            {
              id: 3,
              name: 'Painting',
              to: '/gallery/painting'
            }
          ]
        }
      ],
      miniVariant: false,
      right: true,
      title: 'Vuetify.js'
    }
  }
}
</script>
