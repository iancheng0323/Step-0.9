<template>
  <v-container>
    <MountainHeader></MountainHeader>
    <v-container>
      <MountainCard
      @addTodo="addTodo">
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
    methods:{
      addTodo(res){
        console.log(res)
      },

    },
}
</script>

<style scoped>

</style>