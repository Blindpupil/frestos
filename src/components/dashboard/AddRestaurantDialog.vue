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
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap row>
              <v-flex xs12 md6>
                <v-text-field 
                  label="Name*" v-model="name" required
                  hint="The restaurant's, not yours"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select 
                  :items="['5', '4', '3', '2', '1']" label="Rating" 
                  v-model="rating" hint="How bad was it?"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field 
                  label="Location*" v-model="location" required
                  hint="Would help others locate it" 
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Link" v-model="link" hint="If you have it"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea label="Comment" v-model="comment" hint= "Share your experience"></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-form>
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
  import { mapGetters } from 'vuex'

  export default {
    name: 'add-restaurant-dialog',
    data() {
      return {
        valid: true,
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
      ...mapGetters({
        error: 'error',
        user: 'currentUser'
      })
    },
    methods: {
      writeRestaurant() {
        const inputs = {
          name: this.name,
          location: this.location,
          rating: this.rating,
          link: this.link,
          uid: this.user
        }
        return this.$store.dispatch('writeRestaurantToFb', inputs)
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
          if (this.error.message) {
            console.error('error at submitInfo during writeRestaurant', this.error.message)
            this.error_alert = true
          } else {
            // use the restaurant id to push the comment, if any
            if (this.comment) this.writeComment(restoId)

            // if resto created successfully display a success message
            this.success_alert = true
            // close dialog and reset fields
            this.dialog = false
            this.clear()
          }
        })
      },
      clear() {
        this.$refs.form.reset();
      },
      hideNotif() {
        // hide all notifications
        this.$store.commit('clearError')
        this.error_alert = false
      }
    }
  };
</script>

<style scoped>

</style>
