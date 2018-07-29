<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-btn slot="activator">sign up</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Sign up :D</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap v-model="valid">
            <!--<v-form >-->
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
                              hint="No requirements: if you get hacked is your problem"
                              v-model="password" :rules="passwordRules" @focus="hideNotif"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  :items="['Restaurants', 'Patisseries', 'E-sports', 'Real sports', 'Trolling']"
                  label="Interests"
                  multiple
                  autocomplete
                  chips
                ></v-select>
              </v-flex>
            <!--</v-form>-->

            <!--// Alert -->
            <v-alert outline type="success" dismissible v-model="alert" transition="slide-x-transition">
              {{ (err.code !== '')? err.message : 'You have successfully signed up. ' }}
            </v-alert>

          </v-layout>
        </v-container>
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
  import firebase from 'firebase';
  import { usersRef } from '../firebase/'; // TODO: see if this is required here

  export default {
    name: 'sign-up',
    data() {
      return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        alert: false,
        valid: false,
        first_name: '',
        last_name: '',
        nameRules: [v => !!v || 'Full name is required'],
        password: '',
        passwordRules: [v => !!v || 'Password is required'],
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        err: {
          code: '',
          message: ''
        }
      };
    },
    methods: {
      clear() {
        this.$refs.form.reset();
      },
      signUp() {
        // check if all fields are filled
        if (this.email && this.password && this.first_name && this.last_name) {
          // create a new user with the provided email and password
          firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then((user) => {
              // if user created successfully add it to the db and display a success message
              this.userUID = user.uid;
              this.addUser(user.uid);
              this.alert = true;
            })
            // if creating user fails display an error message
            // eslint-disable-next-line
            .catch(err => {
              this.err = Object.assign({}, err);
              this.alert = true;
            });
        } else {
          this.err.code = 'Empty Fields';
          this.err.message = 'Fill in all required fields. Please and thank you';
          this.alert = true;
        }
      },
      hideNotif() {
        // hide all notifications
        this.err.code = '';
        this.err.message = '';
      },
      addUser(userUID) {
        // add the new user credentials to the database using the same ID
        firebase.database().ref(`users/${userUID}`).set({
          first_name: this.first_name,
          last_name: this.last_name,
          interests: this.interests,
          email: this.email
        });
      }
    }
  };
</script>

<style scoped>

</style>
