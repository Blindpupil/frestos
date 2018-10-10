<template>
  <div>     
    <h1>Welcome to your Dashboard!</h1>
    <p>Here you can:</p>
    <ul>
      <li> add new restaurants </li>
      <li> add new friends to see their reviews and activities</li>
      <li> create meetings with your friends to visit these restaurants together </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'restaurants',
    computed: mapGetters(['restaurants']),
    data() {
      return {};
    }
  };
</script>

<style scoped lang="scss">

</style>
 