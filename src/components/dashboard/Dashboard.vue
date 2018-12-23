<template>
  <v-app dark id="inspire">
    <v-navigation-drawer fixed clipped v-model="drawer" app>
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.text" @click="route(item.link)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <p> {{item.text}} </p>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader class="mt-3 grey--text text--darken-1">FOODY FRIENDS</v-subheader>

        <v-list>
          <v-list-tile v-for="item in friends" :key="item.text" avatar>
            <v-list-tile-avatar>
              <img :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`" alt="">
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>

        <v-list-tile class="mt-3">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Add New Friend</v-list-tile-title>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Manage Your Options</v-list-tile-title>
        </v-list-tile>
        
        <v-list-tile @click="logout" class="hoverable">
          <v-list-tile-action>
            <v-icon color="grey darken-1">power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Sign Out</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <!-- TODO: add a nice little logo icon here -->
      <!-- <v-icon class="mx-3">fa-youtube</v-icon>-->
      <v-toolbar-title class="mr-5 align-center">
        <span class="title"><router-link to="/"> Frestos </router-link></span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-layout row align-center style="max-width: 650px">
        <v-text-field
          placeholder="Search..."
          single-line
          append-icon="search"
          @click:append="() => {}"
          color="white"
          hide-details
        ></v-text-field>
      </v-layout>
    </v-toolbar>

    <v-content>
      <v-container fill-height fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Routes from '@/router'
  import { mapGetters } from 'vuex'
  import { auth } from '@/firebase'
  import { LOGOUT, HANDLE_GOOGLE_RESPONSE } from '@/store/types/action_types'

  export default {
    name: 'Dashboard',
    components: {
      Routes
    },
    created() {
      // Handle response from Google OAuth
      this.$store.dispatch(HANDLE_GOOGLE_RESPONSE)
    },
    computed: {
      ...mapGetters({
        // map this.user to this.$store.getters.auth.currentUser
        user: 'currentUser'
      })
    },
    data() {
      return {
        drawer: true,
        items: [
          { icon: 'trending_up', text: 'Restaurants', link: '/dashboard/restaurants' },
          { icon: 'event', text: 'Meetings', link: '/dashboard/meetings' }
        ],
        friends: [
          { picture: 28, text: 'Joseph' },
          { picture: 38, text: 'Apple' },
          { picture: 48, text: 'Xbox Ahoy' },
          { picture: 58, text: 'Nokia' },
          { picture: 78, text: 'MKBHD' }
        ]
      }
    },
    methods: {
      route(link) {
        this.$router.push(link)
      },
      logout() {
        this.$store.dispatch(LOGOUT)
          .then(() => this.$router.push('/login'))
      }
    }
  }
</script>

<style scoped lang="scss">
  // TODO: create files with custom variables, mixins, etc. See https://vuetifyjs.com/en/style/colors
  $primary: lightgray;

  .title a {
    color: $primary;
    text-decoration: none;
  }
  .hoverable:hover {
    i {
      color: $primary !important;
    }
    .list__tile__title {
      color: $primary !important;
    }
  }
</style>
