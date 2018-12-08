<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    
    <slot slot="activator"></slot>
    
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
                <v-text-field label="Photo" v-model="newPhotoUrl" hint="URL to a pic of the place if you have it"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea label="Comment" v-model="newComment" hint= "Share your experience"></v-textarea>
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
  import { WRITE_RESTO_TO_FB } from '@/store/types/action_types'
  import { CLEAR_ERROR } from '@/store/types/mutation_types'
  

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
        newComment: '',
        newPhotoUrl: '',
      };
    },
    computed: {
      ...mapGetters(['error', 'currentUser'])
    },
    methods: {
      submitInfo() {
        const inputs = {
          name: this.name,
          location: this.location,
          rating: this.rating,
          link: this.link,
          newPhotoUrl: this.newPhotoUrl,
          photos: {
            source: this.currentUser,
            url: this.newPhotoUrl,
            main: true
          },
          comment: {
            content: this.newComment,
            uid: this.currentUser
          }
        }
        this.$store.dispatch(WRITE_RESTO_TO_FB, inputs)
          .then(() => {
            this.clear()
            this.dialog = false
          })
      },
      clear() {
        this.$refs.form.reset();
      },
      hideNotif() {
        // hide all notifications
        this.$store.commit(CLEAR_ERROR)
        this.error_alert = false
      }
    }
  };
</script>

<style scoped>

</style>
