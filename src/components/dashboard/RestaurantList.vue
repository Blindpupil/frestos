<template>
  <v-layout row>
    <v-flex xs12>
      <h2> 
        <slot></slot> 
      </h2>

      <v-card>
        <p>
          {{ restaurants }}
        </p>
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          height="200px"
        >
        </v-img>

        <v-card-title primary-title>
          <div>
            <div class="headline">Top western road trips</div>
            <span class="grey--text">1,000 miles of wonder</span>
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
            I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { restosRef } from '@/firebase';
  import AddRestaurantDialog from '@/components/dashboard/AddRestaurantDialog'

  export default {
    name: 'restaurant-list',
    inheritAttrs: false,
    components: {
      AddRestaurantDialog
    },
    created() {
      this.$store.dispatch('setRestosRef', restosRef)
    },
    computed: mapGetters(['restaurants']),
    data() {
      return {
        show: false
      };
    }
  };
</script>

<style scoped lang="scss">

</style>
 