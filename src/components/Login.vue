<template>
  <v-app dark>
    <v-layout row align-center justify-center class="login">
      <v-flex md6 lg4>
        <v-form ref="form" lazy-validation>
          <h2>Please login to access your dashboard</h2>
          <v-text-field label="E-mail" v-model="email" @focus="hideNotif" required></v-text-field>

          <v-text-field name="input-10-1" label="Enter your password" v-model="password" required
                        :append-icon="e1 ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (e1 = !e1)"
                        :type="e1 ? 'password' : 'text'" @keyup.enter="login" @focus="hideNotif"
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

        <v-alert outline type="error" dismissible v-model="alert" transition="slide-x-transition">
          {{ error }}
        </v-alert>
        
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import signup from '@/components/Signup'

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
      }
    },
    computed: {
      ...mapState({
        // map this.$store.state.auth.error to this.error
        error: state => state.auth.error.message
      })
    },
    methods: {
      login() {
        const inputs = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('login', inputs)
          .then(() => {
            if (this.error) {
              this.alert = true
            } else {
              this.$router.push('/dashboard')
            }
          })
      },
      clear() {
        this.$refs.form.reset()
      },
      hideNotif() {
        this.alert = false
        this.$store.commit('setError', {})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    background-image: url("../assets/section.jpg");
    background-size: auto;
  }
</style>
