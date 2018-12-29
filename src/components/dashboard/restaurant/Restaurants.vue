<template>
  <v-layout>
    <v-flex>
      <v-tabs centered light icons-and-text>
        <v-tabs-slider color="purple"></v-tabs-slider>

        <v-tab href="#favorites">
          My Restaurants
          <v-icon>favorite</v-icon>
        </v-tab>

        <v-tab href="#recommended">
          Recommended
          <v-icon>account_box</v-icon>
        </v-tab>

        <v-tab-item id="favorites">
          <restaurant-list> </restaurant-list>
        </v-tab-item>

        <v-tab-item id="recommended">
          <recommended-list> </recommended-list>
        </v-tab-item>
      </v-tabs>
    </v-flex>

    <add-restaurant-dialog> 
      <v-tooltip left>
        <v-btn slot="activator" fixed bottom right fab dark color="indigo">
          <v-icon dark>add</v-icon>
        </v-btn>
        <span>Add restaurant</span>
      </v-tooltip>
    </add-restaurant-dialog>
  </v-layout>
</template>

<script>
  import AddRestaurantDialog from '@/components/dashboard/restaurant/AddRestaurantDialog'
  import RestaurantList from '@/components/dashboard/restaurant/RestaurantList'
  import RecommendedList from '@/components/dashboard/restaurant/RecommendedList'

  export default {
    name: 'restaurants',
    inheritAttrs: false,
    components: {
      AddRestaurantDialog,
      RecommendedList,
      RestaurantList
    }
  }
</script>

<style scoped lang="scss">

</style>
 