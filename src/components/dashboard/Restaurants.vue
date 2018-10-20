<template>
  <div>     
    <h2>Content from Restaurants Component </h2>

    <add-restaurant-dialog> Add Restaurant </add-restaurant-dialog>

    <!-- <v-card>
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
    </v-card> -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { restosRef } from '@/firebase';
  import AddRestaurantDialog from '@/components/dashboard/AddRestaurantDialog'

  export default {
    name: 'restaurants',
    inheritAttrs: false,
    components: {
      AddRestaurantDialog
    },
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
.card {
  position: static;

  .bottom-nav {
    width: 20%;
  }
}
</style>
 