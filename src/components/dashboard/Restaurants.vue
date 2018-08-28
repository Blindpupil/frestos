<template>
  <div> 
          <h2>Content from restaurants component </h2>
          <p> {{ restaurants }}</p>  
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { restosRef } from '@/firebase/'

  export default {
    name: 'restaurants',
    created() {
      this.$store.dispatch('setRestosRef', restosRef)
    },
    components: {},
    computed: mapGetters(['restaurants']),
    data() {
      return {
        name: ''
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
