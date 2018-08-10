<template>
  <div> 
        <div>
          <v-card>
              <v-bottom-nav :active.sync="bottomNav" :value="true" absolute color="transparent">
                  <v-btn color="teal" flat value="recent">
                      <span>Recent</span>
                      <v-icon>history</v-icon>
                  </v-btn>  
                    <v-btn color="teal" flat value="favorites">
                        <span>Favorites</span>
                        <v-icon>favorite</v-icon>
                    </v-btn>
                  <v-btn color="teal" flat value="nearby">
                    <span>Nearby</span>
                    <v-icon>place</v-icon>
                  </v-btn>
              </v-bottom-nav>
          </v-card>
        </div>

          <h2>Content from restaurants component </h2>
          <p> {{ restaurants }}</p>  
  </div>
</template>

<script>
	import firebase from 'firebase';
  import { mapGetters } from 'vuex';
  import { restosRef } from '../../firebase/';

  export default {
    name: 'restaurants',
    created() {
      this.$store.dispatch('setRestosRef', restosRef)
    },
    components: {},
    computed: mapGetters(['restaurants']),
    data() {
      return {
          name: ''
      };
    }
  };
</script>

<style scoped lang="scss">

</style>
