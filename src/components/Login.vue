<template>
  <v-app dark>
    <v-layout row align-center justify-center class="login">
      <v-flex md6 lg4>
        <v-form ref="form" lazy-validation>
          <h2>Please login to access your dashboard</h2>
          <v-text-field label="E-mail" v-model="email" required></v-text-field>

          <v-text-field name="input-10-1" label="Enter your password" v-model="password" required
                        :append-icon="e1 ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (e1 = !e1)"
                        :type="e1 ? 'password' : 'text'"
          ></v-text-field>

          <v-btn @click="login">
            login
          </v-btn>

          <v-btn @click="clear">clear</v-btn>

          <!--// Dialog-->
          <signup btnclass="blue-grey">
            Not a member?
          </signup>

        </v-form>

        <v-alert outline type="warning" dismissible v-model="alert" transition="slide-x-transition">
          {{ error }}
        </v-alert>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  import signup from './Signup';
  import firebase from 'firebase';

  export default {
    name: 'log-in',
    components: {
      signup
    },
    data() {
      return {
        alert: false,
        email: '',
        password: '',
        e1: true,
        error: ''
      };
    },
    methods: {
      login() {
        // login to firebase with email and password
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(() => { // .then((user) => {
            // redirect to the admin page
            this.$router.push('/dashboard');
          })
          .catch((error) => {
            this.alert = true;
            this.error = error.message;
          });
      },
      clear() {
        this.$refs.form.reset();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .login {
    background-image: url("../assets/section.jpg");
    background-size: auto;
  }
</style>
