<template>
  <div>     
    <add-restaurant-dialog> Add Restaurant </add-restaurant-dialog>
    <restaurant-list> These are your restaurants </restaurant-list>

    <!-- TODO: Fix this piece of UI
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
    </v-card> -->
  </div>
</template>

<script>
  import AddRestaurantDialog from '@/components/dashboard/AddRestaurantDialog'
  import RestaurantList from '@/components/dashboard/RestaurantList'

  export default {
    name: 'restaurants',
    inheritAttrs: false,
    components: {
      AddRestaurantDialog,
      RestaurantList
    },
    data() {
      return {};
    }
  };
</script>

<style scoped lang="scss">

</style>
 