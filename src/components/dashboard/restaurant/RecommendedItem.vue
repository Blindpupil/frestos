<template>
  <v-flex xs12 sm6 md4>
    <v-card>
      <v-img class="white--text" height="200px" :src="photoUrl">
        <v-container fill-height fluid pa-0>
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <v-tooltip top>
                <v-btn dark icon slot="activator" @click="addResto">
                  <v-icon>favorite_border</v-icon>
                </v-btn>
                <span>Add to my restaurants</span>
              </v-tooltip>
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
</template>

<script>
  import { find, isEmpty } from 'lodash-es'
  import { mapGetters } from 'vuex'
  import EditRestaurantDialog from '@/components/dashboard/restaurant/EditRestaurantDialog'
  import { ADD_RESTO_TO_USER } from '@/store/types/action_types'

  export default {
    name: 'recommended-item',
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
        if (isEmpty(this.card.comments)) {
          return { content: 'There are no opinions of this place so far' }
        } else {
          // For now grab the first comment. In the future will be all friends' comments
          return this.card.comments[0]
        }
      },
      photoUrl() {
        const cardsDefault = find(this.card.photos, o => o.main)

        if (isEmpty(cardsDefault)) {
          return 'https://via.placeholder.com/500x200.png?text=No+pics+here+...yet!'
        } else {
          return cardsDefault.url
        }
      }
    },
    methods: {
      addResto() {
        const restoKey = this.card['.key']
        this.$store.dispatch(ADD_RESTO_TO_USER, restoKey)
      }
    }
  }
</script>

<style scoped lang="scss">
  
</style>
 