<template>
  <v-container>
      <v-card width="400px" min-height="600px" color="white" relative>
        <v-container>
          <v-card-title class="text-color-white">
              <h1 class="display-1 mt-2 font-weight-medium">Routine</h1>
          </v-card-title>
          <v-divider></v-divider>
          <v-btn
          icon
          absolute
          class="addRoutineButton"
          @click="addNewPop = !addNewPop"
          ><v-icon large>add_circle</v-icon></v-btn>
          <ul>
            <li
            is="RoutineItem"
            v-for="(item,index) in routineList.list"
            :key="index"
            :title="item.title"
            :weeklyRoutine="item.weeklyRoutine"
            :monthlyRoutine="item.monthlyRoutine"
            :status="item.status"
            ></li>
          </ul>
        </v-container>
      </v-card>
      <v-dialog 
      :value="addNewPop"
      persistent
      max-width="500">
        <v-card min-height="300" relative>
          <v-card-title>Add New Routine</v-card-title>
          <v-divider></v-divider>
          <v-container>
          <v-card-text>
              <v-form>
                <v-text-field
                  autofocus
                  v-model="newRoutineTitle"
                  label="Routine Name"
                  placeholder="Routine Name. e.g. check email, daily report...">
                </v-text-field>
                <v-select
                  v-model="selectedWeeklyRoutine"
                  :items="weeklyRoutineItems"
                  label="On Every"
                  chips
                  clearable
                  multiple
                  :menu-props="{offsetY: true }"
                >
                </v-select>
              </v-form>
          </v-card-text>
            <v-btn @click="addNewRoutine" class="addRoutineFormButton">Add</v-btn>
            <v-btn @click="addNewPop = false" text class="addRoutineFormButton">Cancel</v-btn>
          </v-container>
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
        addNewPop:false,
        routineList:{
          list:[
            {
              title: '1. Check email',
              weeklyRoutine: [1,2,3,4,5],
              monthlyRoutine: [],
              status:1
            },
            {
              title: '2. Data report',
              weeklyRoutine: [2,3,4],
              monthlyRoutine: [],
              status:1
            },
          ]
        },
        weeklyRoutineItems:[
          {
            text:'Sunday',
            value:0
          },
          {
            text:'Monday',
            value:1
          },
          {
            text:'Tuesday',
            value:2
          },
          {
            text:'Wednesday',
            value:3
          },
          {
            text:'Thursday',
            value:4
          },
          {
            text:'Friday',
            value:5
          },
          {
            text:'Saturday',
            value:6
          },
        ],
        selectedWeeklyRoutine:[],
        newRoutineTitle:'',

      }
    },
    methods:{
      createNewRoutine(title, weeklyRoutine){
        weeklyRoutine = weeklyRoutine.sort()
        let newRoutine = {
          title: title,
          weeklyRoutine: weeklyRoutine,
          monthlyRoutine: []
        }
        return newRoutine
      },
      addNewRoutine(){
        if(this.newRoutineTitle.length == 0){
          console.log('empty input')
        }else{
          this.routineList.list.push(
          this.createNewRoutine(this.newRoutineTitle,this.selectedWeeklyRoutine)
          )
        }
        this.newRoutineTitle = ''
        this.selectedWeeklyRoutine = []
        this.addNewPop = false
      },
    }

}
</script>

<style scoped>
.absolute{
  position: absolute;
}
.addRoutineButton{
  right:20px;
  top:20px;
}
.addRoutineFormButton{
  margin-right: 10px;
}

</style>