<template>

  <v-app light>
    <v-toolbar class="white">
      <v-toolbar-title v-text="title"></v-toolbar-title>
    </v-toolbar>

    <v-content>
      <section>
        <v-parallax :src="require('@/assets/hero.jpeg')" height="600">
          <v-layout
            column
            align-center
            justify-center
            class="white--text"
          >
            <img src="../assets/vuetify.png" alt="Vuetify.js" height="200">
            <h1 class="white--text mb-2 display-1 text-xs-center">Frestos</h1>
            <div class="subheading mb-3 text-xs-center">Restaurants with friends made easy</div>
            <!-- Yes, you can see todos in the source html, so what? -->
            <!-- TODO add link to login page here -->
            <signup activator="Get Started!"> Get Started! </signup>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-layout
          column
          wrap
          class="my-5"
          align-center
        >
          <v-flex xs12 sm4 class="my-3">
            <div class="text-xs-center">
              <h2 class="headline">The best way to find reliable dining experiences</h2>
              <span class="subheading">
                Because ratings and opinions in the internet have lost all meaning.
              </span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>

                <v-flex xs12 md4 text-xs-center>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">color_lens</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Create your own resto guide</div>
                    </v-card-title>
                    <v-card-text>
                      Hopefully easy-to-use app to get the most out of restaurants and friendships:
                      log into your dashboard, see available restaurants near you, check out the ratings
                      and opinions your friends have provided, organize dinners with them, be happy.
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 md4 text-xs-center>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">flash_on</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">Fast development</div>
                    </v-card-title>
                    <v-card-text>
                      Have an idea on how to make the app better? Submit an issue ticket through github
                      and we'll make it happen! Don't know how to do that? Then probably your opinion
                      is not important... Thanks for trying though.
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 md4 text-xs-center>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">build</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Completely Open Sourced</div>
                    </v-card-title>
                    <v-card-text>
                      Do you want to continue the development of this project? Do you know anything about
                      web development? Do you want to troll with the project or hack everyone's info out
                      of it? Feel free to do it! The code is open source: link to github in the
                      <a href="#footer">footer</a>.
                    </v-card-text>
                  </v-card>
                </v-flex>

              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>

      <section>
        <v-parallax :src="require('@/assets/section.jpg')" height="380">
          <v-layout column align-center justify-center>
            <div class="headline white--text mb-3 text-xs-center">Finding a good restaurant has never been easier</div>
            <em>This section has a parallax image for the lols</em>
            <!-- TODO add link to login page here -->
            <signup activator="Sign up, it's free!"> Sign up, it's free! </signup>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-5">
            <v-flex xs12 sm4 text-xs-justify>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Company info</div>
                </v-card-title>
                <v-card-text>
                  Amazing company built in a coffee shop while actual work applications compile.
                  You'll be happy to know that all of your data is being handled through google,
                  so if something happens it's on them not me.
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Contact us</div>
                </v-card-title>
                <v-card-text>
                  Your opinion is important to us! (Conditions apply)
                </v-card-text>
                <v-list class="transparent">
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="blue--text text--lighten-2">phone</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>777-867-who uses land lines anymore?</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="blue--text text--lighten-2">place</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Coffee shop, FR</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="blue--text text--lighten-2">email</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>frestos@gmail.com (don't buy the domain please)</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>

      <v-footer id="footer" class="blue darken-2">
        <v-layout row wrap align-center>
          <v-flex xs12>
            <div class="white--text ml-3">
              Made with
              <v-icon class="red--text">favorite</v-icon>
              with <a class="white--text" href="https://vuetifyjs.com" target="_blank">Vuetify</a>
              and <a class="white--text" href="https://firebase.google.com" target="_blank">Firebase</a>
              and <a class="white--text" href="https://vuex.vuejs.org" target="_blank">Vuex</a>
              and <a class="white--text" href="https://github.com/posva/vuexfire" target="_blank">VuexFire</a>
              by <a class="white--text" href="https://github.com/blindpupil">señor developer</a>
            </div>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-content>
  </v-app>

</template>

<script>
  import Signup from '@/components/Signup'

  export default {
    name: 'Home',
    components: {
      signup: Signup
    },
    data() {
      return {
        title: 'Frestos'
      }
    }
  }
</script>

<style scoped>

</style>
