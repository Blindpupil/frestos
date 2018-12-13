<template>
  <v-flex>
    <add-restaurant-dialog> 
      <v-btn fixed bottom right fab dark color="indigo">
        <v-icon dark>add</v-icon>
      </v-btn> 
    </add-restaurant-dialog>
    
    <restaurant-list> These are your restaurants </restaurant-list>
  </v-flex>
</template>

<script>
  import AddRestaurantDialog from '@/components/dashboard/restaurant/AddRestaurantDialog'
  import RestaurantList from '@/components/dashboard/restaurant/RestaurantList'

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
 