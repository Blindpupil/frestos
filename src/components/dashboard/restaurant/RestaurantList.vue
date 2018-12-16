<template>
  <v-container grid-list-md px-0>
    <v-layout row wrap>
      <restaurant-item 
        v-for="card in userRestaurantCards" 
        :key="card['.key']" 
        :card="card"
      >
      </restaurant-item>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import RestaurantItem from '@/components/dashboard/restaurant/RestaurantItem'
  import { GET_RESTOS_CARDS } from '@/store/types/action_types'

  export default {
    name: 'restaurant-list',
    components: {
      RestaurantItem
    },
    computed: {
      ...mapGetters(['userRestaurantCards'])
    },
    created() {
      this.$store.dispatch(GET_RESTOS_CARDS)
    }
  };
</script>

<style scoped lang="scss">

</style>
 