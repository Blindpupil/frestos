<template>
  <v-layout row class="mb-3">
    <v-flex xs12 sm6>
      <v-card>

        <v-img
          class="white--text"
          height="200px"
          :src="photoUrl"
        >
          <v-container fill-height fluid class="card-edit">
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <v-menu bottom right>
                  <v-btn slot="activator" dark icon>
                    <v-icon>more_vert</v-icon>
                  </v-btn>

                  <v-list>        
                    <edit-restaurant-dialog :card="card" :previousComment="comment"></edit-restaurant-dialog>

                    <v-list-tile >
                      <v-list-tile-title>Delete</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>

        <v-card-title>
          <div>
            <span class="grey--text">Friends rating: {{ card.rating }}</span><br>
            <h3>{{ card.name }}</h3><br>
            <span>{{ card.location }}</span>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="purple">Comments</v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-slide-y-transition>
          <v-card-text v-show="show">
            <div> {{ comment.content }} </div>
          </v-card-text>
        </v-slide-y-transition>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { find, isEmpty } from 'lodash-es'
  import { mapGetters } from 'vuex'
  import EditRestaurantDialog from '@/components/dashboard/restaurant/EditRestaurantDialog'

  export default {
    name: 'restaurant-item',
    components: {
      EditRestaurantDialog
    },
    props: {
      card: Object
    },
    data() {
      return {
        show: false,
        name: this.card.name,
        location: this.card.location,
        rating: this.card.rating,
        link: this.card.link
      }
    },
    computed: {
      comment() {
        // Grab the content of the comment that the current user wrote for the current restaurant
        if (isEmpty(this.card.comments)) {
          return { content: 'You have no opinions of this place so far' }
        } else {
          const userComment = find(this.card.comments, o => o.uid === this.currentUser)
          return userComment
        }
      },
      photoUrl() {
        const cardsDefault = find(this.card.photos, o => o.default)

        if (isEmpty(cardsDefault)) {
          return 'https://via.placeholder.com/500x200.png?text=No+pics+here+...yet!'
        } else {
          return cardsDefault.url
        }
      },
      ...mapGetters(['currentUser'])
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .card-edit {
    padding: 0;
  }
</style>
 