<template>
  <v-app dark>
    <v-layout row align-center justify-center class="login">
      <v-flex md6 lg4>
        <v-form ref="form" lazy-validation>
          <h2>Please login to access your dashboard</h2>

          <v-btn color="red" class="white--text" @click="googleAuth">
            <v-icon dark left>public</v-icon>
            Continue with Google
          </v-btn>

          <v-btn color="blue" class="white--text" @click="facebookAuth">
            <v-icon dark left>people</v-icon>
            Continue with Facebook
          </v-btn>

          <v-text-field label="E-mail" v-model="email" @focus="hideNotif" required></v-text-field>

          <v-text-field
            :append-icon="show ? 'visibility_off' : 'visibility'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            v-model="password"
            name="password" label="Password" hint="At least 6 characters" 
            class="input-group--focused"
          ></v-text-field>

          <v-btn @click="login"> login </v-btn>

          <v-btn @click="clear"> clear </v-btn>

          <!--// Dialog-->
          <signup btnclass="blue-grey">
            Not a member?
          </signup>

        </v-form>

        <v-alert type="error" dismissible v-model="alert" transition="slide-x-transition">
          {{ error.message }}
        </v-alert>
        
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { isEmpty } from 'lodash-es'
  import signup from '@/components/Signup'
  import { SET_ERROR, CLEAR_ERROR } from '@/store/types/mutation_types'
  import {
    LOGIN,
    GOOGLE_AUTH,
    FACEBOOK_AUTH
  } from '@/store/types/action_types'

  export default {
    name: 'log-in',
    components: {
      signup
    },
    data() {
      return {
        email: '',
        password: '',
        show: false,
        alert: false
      }
    },
    computed: {
      // map this.$store.getters.errors.error to this.error
      ...mapGetters(['error', 'currentUser'])
    },
    methods: {
      login() {
        const inputs = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch(LOGIN, inputs)
          .then(() => this.handleAuth())
      },
      googleAuth() {
        this.$store.dispatch(GOOGLE_AUTH)
      },
      facebookAuth() {
        this.$store.dispatch(FACEBOOK_AUTH)
      },
      handleAuth() {
        if (isEmpty(this.currentUser)) {
          // Something went wrong
          this.alert = true
        } else {
          this.$router.push('/dashboard')
        }
      },
      clear() {
        this.$refs.form.reset()
      },
      hideNotif() {
        this.alert = false
        this.$store.commit(CLEAR_ERROR)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    background-image: url("../assets/forest.jpg");
    background-size: auto;
  }
</style>
