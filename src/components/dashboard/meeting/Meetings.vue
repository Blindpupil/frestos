<template>
  <v-layout justify-center align-center>
    <v-flex>
      <h2>Content meetings</h2>

      <div>
        <v-date-picker v-model="datepicker" :reactive="reactive"></v-date-picker>
        <v-time-picker v-model="timepicker" :reactive="reactive"></v-time-picker>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
  name: 'meetings',
  data() {
    return {
        datepicker: null,
        timepicker: null,
        landscape: true,
        reactive: false
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
