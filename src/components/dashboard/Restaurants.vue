<template>
  <div>     
    <h2>Content from Restaurants Component </h2>
    <p> {{ restaurants }} </p>

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
</template>

<script>
  import { mapGetters } from 'vuex';
  import { restosRef } from '@/firebase';

  export default {
    name: 'restaurants',
    created() {
      this.$store.dispatch('setRestosRef', restosRef)
    },
    computed: mapGetters(['restaurants']),
    data() {
      return {};
    }
  };
</script>

<style scoped lang="scss">

</style>
 