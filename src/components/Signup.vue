<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <!--// Provide button customization to instances of this component-->
    <v-btn v-bind="$attrs" :class="btnclass" slot="activator">
      <slot></slot>
    </v-btn>
    
    <v-card dark>
      <v-card-title
          class="headline grey darken-1"
          primary-title
        >
          Get Started!
      </v-card-title>

      <v-card-text>

        <v-form v-model="valid" lazy-validation>

          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex xs12 sm6>
                <v-text-field label="First name" required
                              hint="What did they call you at birth?"
                              v-model="first_name" :rules="nameRules" @focus="hideNotif"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 sm6>
                <v-text-field label="Last name" required
                              hint="What's your dad or mom last name? (choose your favorite)"
                              v-model="last_name" :rules="nameRules" @focus="hideNotif"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field label="Email" required
                              hint="It's better than signing in through Facebook"
                              v-model="email" :rules="emailRules" @focus="hideNotif"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field label="Password" type="password" required
                              hint="6 letters minimum"
                              v-model="password" :rules="passwordRules" @focus="hideNotif"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-select
                  :items="['Restaurants', 'Patisseries', 'E-sports', 'Real sports', 'Trolling']"
                  v-model="interests"
                  label="Interests"
                  multiple
                  autocomplete
                  chips
                ></v-select>
              </v-flex>

              <!--// Alert -->
              <v-alert outline type="error" dismissible v-model="error_alert" transition="slide-x-transition">
                {{ error }}
              </v-alert>

              <v-alert outline type="success" dismissible v-model="success_alert" transition="slide-x-transition">
                You have successfully signed up. Check out your
                <router-link to="/dashboard">Dashboard</router-link>
              </v-alert>

            </v-layout>
          </v-container>

        </v-form>  
        
        <small>*indicates required field (duh)</small>

      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        <v-btn color="blue darken-2" flat @click.native="signUp()" :disabled="!valid">Save</v-btn>
      </v-card-actions>
      
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'sign-up',
    inheritAttrs: false,
    props: ['btnclass'],
    data() {
      return {
        dialog: false,
        interests: [],
        notifications: false,
        sound: true,
        widgets: false,
        error_alert: false,
        success_alert: false,
        valid: false,
        first_name: '',
        last_name: '',
        nameRules: [v => !!v || 'Full name is required'],
        password: '',
        passwordRules: [
          v => !!v || 'Password is required',
          v => v? v.length >= 6 || 'Password must at least 6 characters' : ''
        ],
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ]
      };
    },
    computed: {
      ...mapState({
        error: state => state.auth.error.message,
        user: state => state.auth.currentUser
      })
    },
    methods: {
      clear() {
        this.$refs.form.reset();
      },
      signUp() {
        // check if all fields are filled
        if (this.email && this.password && this.first_name && this.last_name) {
          // create a new user with the provided info
          const inputs = {
            email: this.email,
            password: this.password,
            first_name: this.first_name,
            last_name: this.last_name,
            interests: this.interests
          }
          this.$store.dispatch('signup', inputs)
            .then(() => {
              if (this.error) {
                this.error_alert = true
              } else {
                // if user created successfully display a success message
              this.success_alert = true
              }
            })
        } else {
          const error = {
            code: 'Empty Fields',
            message: 'Fill in all required fields please and thank you'
          }
          this.$store.commit('setError', error)
          this.error_alert = true
        }
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
