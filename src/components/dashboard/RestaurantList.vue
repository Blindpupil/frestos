<template>
  <v-layout row>
    <v-flex xs12>
      <h2> 
        <slot></slot> 
      </h2>

      <restaurant-item></restaurant-item>
    </v-flex>
  </v-layout>
</template>

<script>
  import RestaurantItem from '@/components/dashboard/RestaurantItem'

  export default {
    name: 'restaurant-list',
    inheritAttrs: false,
    components: {
      RestaurantItem
    }
  };
</script>

<style scoped lang="scss">

</style>
 