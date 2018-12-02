<template>
  <v-layout row>
    <v-flex xs12>
      <h2> 
        <slot></slot> 
      </h2>

      <restaurant-item 
        v-for="card in userRestaurantCards" 
        :key="card['.key']" 
        :card="card"
      >
      </restaurant-item>

    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import RestaurantItem from '@/components/dashboard/restaurant/RestaurantItem'

  export default {
    name: 'restaurant-list',
    components: {
      RestaurantItem
    },
    computed: {
      ...mapGetters(['userRestaurantCards'])
    },
    created() {
      this.$store.dispatch('getRestaurantCards')
    }
  };
</script>

<style scoped lang="scss">

</style>
 