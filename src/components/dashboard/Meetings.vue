<template>
  <div>
     <h2 text-align-center>Meeting content</h2>
        <div>
           <v-date-picker v-model="datepicker" :landscape="reactive"></v-date-picker>
           <v-time-picker v-model="timepicker" :reactive="reactive"></v-time-picker>
        </div>
  </div>
</template>

<script>
  export default {
  name: 'meetings',
  data() {
    return {
        datepicker: null,
        timepicker: null,
        landscape: false,
        reactive: true
      }
    }
  }
</script>

<style scoped lang="scss">
 
</style>
