<template>
  <v-app dark id="inspire">
    <v-navigation-drawer fixed clipped v-model="drawer" app light>
      <v-list dense>

        <v-list-tile class="py-3" @click="route('/dashboard')">
          <v-list-tile-avatar size="50">
            <img :src="userObj.picture" alt="Profile Picture">
          </v-list-tile-avatar>
          <v-list-tile-title v-text="userObj.name"></v-list-tile-title>
        </v-list-tile>

        <v-list-tile
          v-for="item in items" :key="item.text"
          @click="route(item.link)"
          :class="[ activetab === item.tab ? 'active' : '' ]">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <p>{{item.text}}</p>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader class="mt-3 grey--text text--darken-1">FOODY FRIENDS</v-subheader>

        <v-list>
          <v-list-tile v-for="person in peopleList" :key="person.userKey" avatar>
            <v-list-tile-avatar>
              <img 
                :src="person.picture ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQevgWjR63wZ3_lGeYbgHAU_eYW4iaxCHxmkxi8bLmcoop-QlsVvQ'" 
                alt="User profi;e"
              >
            </v-list-tile-avatar>
            <v-list-tile-title>
              {{ person.name }}

              <span v-if="person.status" :class="person.status">
                {{ `(${person.status})` }}
              </span>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>

        <v-list>
          <v-list-tile>
            <add-friends-dialog> 
              <v-btn round color="blue-grey" class="white--text my-3">
                <v-icon left dark>add_circle_outline</v-icon>
                Add new friends
              </v-btn>
            </add-friends-dialog>
          </v-list-tile>
        </v-list>

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
  import { auth, usersRef } from '@/firebase'
  import {
    LOGOUT,
    HANDLE_PROVIDER_RESPONSE,
    SET_USER_REF
  } from '@/store/types/action_types'
  import AddFriendsDialog from '@/components/dashboard/friends/AddFriendsDialog'

  export default {
    name: 'Dashboard',
    components: {
      Routes,
      AddFriendsDialog
    },
    async created() {
      this.handleTab(window.location.href)
      // Handle response from auth provider
      await this.$store.dispatch(HANDLE_PROVIDER_RESPONSE)

      // Set user object
      const user = this.currentUser
      await this.$store.dispatch(SET_USER_REF, usersRef.child(user))
    },
    computed: {
      ...mapGetters(['userObj', 'currentUser', 'peopleList'])
    },
    data() {
      return {
        drawer: true,
        activetab: '',
        items: [
          {
            icon: 'room_service',
            text: 'Restaurants',
            link: '/dashboard/restaurants',
            tab: 'restaurants'
          },
          {
            icon: 'event',
            text: 'Meetings',
            link: '/dashboard/meetings',
            tab: 'meetings'
          }
        ]
      }
    },
    methods: {
      route(link) {
        this.handleTab(link)
        this.$router.push(link)
      },
      handleTab(link) {
        const tab = link.substr(link.lastIndexOf('/') + 1)

        tab === 'dashboard'
          ? this.activetab = ''
          : this.activetab = tab
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
  $secondary: #ffeecc;

  .title a {
    color: $primary;
    text-decoration: none;
  }

  .v-list .active {
    background-color: $secondary;
  }

  .v-list__tile__title .pending {
    color: $primary;
    font-style: italic;
  }
</style>
