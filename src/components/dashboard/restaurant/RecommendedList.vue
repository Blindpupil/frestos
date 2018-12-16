<template>
  <v-container grid-list-md px-0>
    <v-layout row wrap>
      <recommended-item 
        v-for="card in userRecommendedCards" 
        :key="card['.key']" 
        :card="card"
      >
      </recommended-item>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import RecommendedItem from '@/components/dashboard/restaurant/RecommendedItem'

  export default {
    name: 'recommended-list',
    components: {
      RecommendedItem
    },
    computed: {
      ...mapGetters(['userRecommendedCards'])
    }
  };
</script>

<style scoped lang="scss">

</style>
 