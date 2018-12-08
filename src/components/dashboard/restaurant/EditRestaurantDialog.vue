<template>
  <v-dialog v-model="dialog" persistent max-width="500px">

    <v-list-tile slot="activator">
      <v-list-tile-title>
        Edit
      </v-list-tile-title>
    </v-list-tile>

    <v-card>
      <v-card-title>
        <span class="headline">Editing a restaurant</span>
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
                  :items="['5', '4', '3', '2', '1']" label="Your rating" 
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
                <v-textarea 
                  label="Comment" hint= "Share your experience"
                  :placeholder="previousComment.content" 
                  v-model="newComment">
                </v-textarea>
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
  import { isEmpty } from 'lodash-es'
  import { mapGetters } from 'vuex'
  import { WRITE_RESTO_TO_FB } from '@/store/types/action_types'

  export default {
    name: 'edit-restaurant-dialog',
    props: {
      card: Object,
      previousComment: Object
    },
    data() {
      return {
        valid: true,
        dialog: false,
        newComment: '',
        name: this.card.name,
        location: this.card.location,
        rating: this.card.rating,
        link: this.card.link,
        photos: this.card.photos,
        newPhotoUrl: ''
      }
    },
    computed: {
      ...mapGetters(['error', 'success', 'currentUser'])
    },
    methods: {
      submitInfo() {
        const inputs = {
          '.key': this.card['.key'],
          users: this.card.users,
          name: this.name,
          location: this.location,
          rating: this.rating,
          link: this.link,
          newPhotoUrl: this.newPhotoUrl,
          photos: this.card.photos,
          comment: {
            '.key': this.previousComment['.key'],
            restaurant: this.card['.key'],
            content: this.newComment,
            uid: this.currentUser
          }
        }

        this.$store.dispatch(WRITE_RESTO_TO_FB, inputs)
          .then(() => this.dialog = false)
      },
      clear() {
        this.$refs.form.reset();
      }
    }
  };
</script>

<style scoped>

</style>
