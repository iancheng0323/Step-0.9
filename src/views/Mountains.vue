<template>
  <v-container>
      <v-btn>
        Add New
      </v-btn>
      <MountainCard>

      </MountainCard>
  </v-container>
</template>

<script>
import MountainCard from '../components/MountainCard.vue'
export default {
    name: 'Mountains',
    components:{
      MountainCard
    },
    

}
</script>

<style scoped>

</style>