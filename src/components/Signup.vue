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
                              v-model="firstName" :rules="nameRules" @focus="hideNotif"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 sm6>
                <v-text-field label="Last name" required
                              hint="What's your dad or mom last name? (choose your favorite)"
                              v-model="lastName" :rules="nameRules" @focus="hideNotif"
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
                <v-autocomplete
                  :items="['Restaurants', 'Patisseries', 'E-sports', 'Real sports', 'Trolling']"
                  v-model="interests"
                  label="Interests"
                  multiple
                  autocomplete
                  chips
                ></v-autocomplete>
              </v-flex>

              <!--// Alert -->
              <v-alert outline type="error" dismissible v-model="error_alert" transition="slide-x-transition">
                {{ error.message }}
              </v-alert>

              <v-alert outline type="success" dismissible v-model="success_alert" transition="slide-x-transition">
                {{ success }}
                Go check out your <router-link to="/dashboard">Dashboard</router-link>!
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
  import { mapGetters } from 'vuex'
  import { isEmpty } from 'lodash-es'
  import { SIGN_UP } from '@/store/types/action_types'
  import {
    SET_ERROR,
    CLEAR_ERROR,
    SET_SUCCESS
  } from '@/store/types/mutation_types'

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
        firstName: '',
        lastName: '',
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
      ...mapGetters(['error', 'success'])
    },
    methods: {
      clear() {
        this.$refs.form.reset();
      },
      signUp() {
        // check if all fields are filled
        if (this.email && this.password && this.firstName && this.lastName) {
          // create a new user with the provided info
          const inputs = {
            email: this.email,
            password: this.password,
            given_name: this.firstName,
            family_name: this.lastName,
            interests: this.interests
          }
          this.$store.dispatch(SIGN_UP, inputs)
            .then(() => {
              if (!isEmpty(this.error.message)) {
                this.error_alert = true
              } else {
                // if user created successfully display a success message
                this.$store.commit(SET_SUCCESS, 'Sign up successful!')
                this.success_alert = true
              }
            })
        } else {
          const error = {
            code: 'Empty Fields',
            message: 'Fill in all required fields please and thank you'
          }
          this.$store.commit(SET_ERROR, error)
          this.error_alert = true
        }
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
