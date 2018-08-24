<template>
   <div>
      <h2>Content meetings</h2>
  <v-layout justify-content-center>
    <div>
      <v-date-picker v-model="datepicker" :reactive="reactive"></v-date-picker>
      <v-time-picker v-model="timepicker" :reactive="reactive"></v-time-picker>
    </div>

 
   </v-layout>
  </div>
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
<v-layout align-center justify-center row fill-height/>