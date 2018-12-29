<template>
  <v-dialog light v-model="dialog" scrollable max-width="500px">
    
    <slot slot="activator"></slot>
    
    <v-card>
      <v-text-field
        v-model="search"
        class="pa-3"
        placeholder="Search..."
        single-line
        append-icon="search"
        color="white"
        hide-details
      ></v-text-field>

      <v-list>
        <v-list-tile
          v-for="user in filteredList"
          :key="user.userKey" avatar
          @click="sendFriendRequest(user)"
        >
          <v-list-tile-action>
            <v-icon color="primary" v-if="!user.status">check_box_outline_blank</v-icon>
            <v-icon color="green" v-if="user.status">check_box</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="user.name"></v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-avatar>
            <img :src="user.picture">
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { SEND_FRIEND_REQUEST, SET_PEOPLE_LIST } from '@/store/types/action_types'
  import { CLEAR_ERROR } from '@/store/types/mutation_types'
  
  export default {
    name: 'add-friends-dialog',
    data() {
      return {
        dialog: false,
        name: '',
        newPhotoUrl: '',
        search: '',
      };
    },
    created() {
      this.$store.dispatch(SET_PEOPLE_LIST)
    },
    computed: {
      ...mapGetters(['error', 'currentUser', 'peopleList']),
      filteredList() {
        return this.peopleList.filter(user => {
          return user.name.toLowerCase().includes(this.search.toLowerCase())
        })
      }
    },
    methods: {
      async sendFriendRequest(user) {
        await this.$store.dispatch(SEND_FRIEND_REQUEST, user)

        // TODO: add ACCEPT_REQUEST
        // TODO: add REMOVE_FRIEND to remove friend or remove friend request
      },
      hideNotif() {
        // Hide all notifications
        this.$store.commit(CLEAR_ERROR)
        this.error_alert = false
      }
    }
  };
</script>

<style scoped>

</style>
