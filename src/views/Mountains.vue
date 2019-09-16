<template>
  <v-container>
    <MountainHeader></MountainHeader>
    <v-container>
      <MountainCard>
      </MountainCard>
    </v-container>
  </v-container>
</template>

<script>
import MountainCard from '../components/MountainCard.vue'
import MountainHeader from '../components/MountainHeader.vue'
export default {
    name: 'Mountains',
    components:{
      MountainCard,
      MountainHeader
    },
    

}
</script>

<style scoped>

</style>