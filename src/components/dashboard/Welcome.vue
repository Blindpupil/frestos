<template>
  <v-layout>
    <v-flex>
      <v-list>
        <h2 class="px-3"> Friend Requests </h2>

        <div v-if="incomingRequests">
          <v-subheader> Incoming requests </v-subheader>
          <v-list-tile v-for="user in incomingRequests" :key="user.userKey" avatar>
            <v-list-tile-avatar>
              <img :src="user.picture">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="user.name"></v-list-tile-title>
            </v-list-tile-content>

            <v-btn round color="primary" @click="acceptRequest(user)">
              Accept Request
            </v-btn>

            <v-btn round color="error" @click="declineRequest(user)">
              Decline Request
            </v-btn>
          </v-list-tile>
        </div>

        <div v-if="sentRequests">
          <v-subheader> Sent requests </v-subheader>
          <v-list-tile v-for="user in sentRequests" :key="user.userKey" avatar>
            <v-list-tile-avatar>
              <img :src="user.picture">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="user.name"></v-list-tile-title>
            </v-list-tile-content>

            <v-btn round color="error" @click="cancelSentRequest(user)">
              Cancel Request
            </v-btn>
          </v-list-tile>
        </div>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {
    ACCEPT_FRIEND,
    CANCEL_SENT_REQUEST,
    DELETE_INCOMING_REQUEST
  } from '@/store/types/action_types'

  export default {
    name: 'welcome',
    data() {
      return {};
    },
    computed: {
      ...mapGetters(['incomingRequests', 'sentRequests'])
    },
    methods: {
      acceptRequest(user) {
        this.$store.dispatch(ACCEPT_FRIEND, user)
      },
      cancelSentRequest(user) {
        this.$store.dispatch(CANCEL_SENT_REQUEST, user)
      },
      declineIncomingRequest(user) {
        this.$store.dispatch(DELETE_INCOMING_REQUEST, user)
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
 