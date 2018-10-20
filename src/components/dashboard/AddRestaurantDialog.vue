<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    
    <v-btn slot="activator" color="primary" dark>
      <slot></slot>
    </v-btn>
    
    <v-card>
      <v-card-title>
        <span class="headline">Adding a restaurant</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap row>
            <v-flex xs12 md6>
              <v-text-field label="Name*" v-model="name" hint="The restaurant's, not yours" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select 
                :items="['5', '4', '3', '2', '1']" label="Rating" 
                v-model="rating" hint="How bad was it?"
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Location*" v-model="location" hint="Would help others locate it" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Link" v-model="link" value="http://crappycrabs.wtf" hint="If you have it" name="link"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                label="Comment" v-model="comment" hint= "Share your experience"
                value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
              ></v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click.native="submitInfo()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'add-restaurant-dialog',
    data() {
      return {
        dialog: false,
        name: '',
        location: '',
        rating: '',
        link: '',
        comment: '',
        error_alert: false,
        success_alert: false
      };
    },
    computed: {
      ...mapState({
        error: state => state.auth.error.message,
        user: state => state.auth.currentUser
      })
    },
    methods: {
      writeRestaurant() {
        const restaurant = {
          name: this.name,
          location: this.location,
          rating: this.rating,
          link: this.link,
          uid: this.user
        }
        return this.$store.dispatch('writeRestaurantToFb', restaurant)
      },
      writeComment(restoId) {
        const comment = {
          content: this.comment,
          uid: this.user,
          restaurant: restoId
        }
        this.$store.dispatch('writeCommentToFb', comment)
      },
      submitInfo() {
        this.writeRestaurant().then(restoId => {
          if (this.error) {
            console.error('error at submitInfo during writeRestaurant', error)
            this.error_alert = true
          } else {
            // use the restaurant id to push the comment
            this.writeComment(restoId)
            // if resto created successfully display a success message
            this.success_alert = true
          }
        })
      },
      clear() {
        this.$refs.form.reset();
      },
      hideNotif() {
        // hide all notifications
        this.$store.commit('setError', {})
        this.error_alert = false
      }
    }
  };
</script>

<style scoped>

</style>
