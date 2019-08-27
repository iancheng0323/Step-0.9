<template>
  <v-container>
      <RoutineItem></RoutineItem>
      <v-btn @click="addNewPop = true">Add New</v-btn>
      <v-dialog :value="addNewPop" @click:outside="addNewPop = false" max-width="500">
        <v-card min-height="300">
          <v-card-title>Add New Routine</v-card-title>
          <v-card-content>
            something
          </v-card-content>
          <v-card-action>
            <v-btn @click="addNewPop = false">add</v-btn>
          </v-card-action>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import RoutineItem from '../components/RoutineItem.vue'
export default {
    name: 'Routines',
    components:{
      RoutineItem
    },
    data(){
      return{
        addNewPop:false
      }
    },
    methods:{
      addNewRoutine(){
        console.log('s')
      },
    }

}
</script>

<style scoped>

</style>