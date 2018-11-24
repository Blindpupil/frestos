<template>
  <div>
    <v-card v-for="resto in cardRestaurants" :key="resto['.key']">
      <v-btn color="pink" dark small absolute right fab>
        <v-icon>delete</v-icon>
      </v-btn>
      
      <v-img :src="resto.photo" height="200px">          
      </v-img>

      <v-card-title primary-title>
        <div>
          <div class="headline">{{ resto.name }}</div>
          <span class="grey--text">{{ resto.location }}</span>
        </div>
      </v-card-title>

      <v-card-actions>
        <v-btn flat color="purple">Explore</v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-slide-y-transition>
        <v-card-text v-show="show">
          {{ resto.comments[0].content }}
        </v-card-text>
      </v-slide-y-transition>
    </v-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'restaurant-item',
    created() {
      this.$store.dispatch('getCardRestaurants')
    },
    computed: mapGetters(['cardRestaurants']),
    data() {
      return {
        show: false
      };
    }
  };
</script>

<style scoped lang="scss">

</style>
 