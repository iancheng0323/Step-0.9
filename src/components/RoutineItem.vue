<template>
    <li class="relative">
        <h3>{{title}}</h3>
        <v-btn
        icon
        absolute
        small
        class="editIcon"
        @click="editPop=true"
        >
            <v-icon>edit</v-icon>
        </v-btn>
        <p>{{weeklyRoutine}}</p>
        <v-dialog 
        :value="editPop"
        persistent
        max-width="500">
            <v-card min-height="300" relative>
            <v-container>
            <v-card-text>
                <v-form>
                    <v-text-field
                    autofocus
                    v-model="editedRoutineTitle"
                    label="Routine Name"
                    placeholder="Routine Name. e.g. check email, daily report...">
                    </v-text-field>
                    <v-select
                    v-model="editedWeeklyRoutine"
                    :items="weeklyRoutineItems"
                    label="On Every"
                    chips
                    clearable
                    multiple
                    :menu-props="{offsetY: true }"
                    >
                    </v-select>
                    <v-switch
                    v-model="editedStatus"
                    :label="switchLabel"
                    ripple
                    >
                    </v-switch>
                </v-form>
            </v-card-text>
                <v-btn @click="editRoutine" class="addRoutineFormButton">Edit</v-btn>
                <v-btn @click="editPop = false" text class="addRoutineFormButton">Discard</v-btn>
            </v-container>
            </v-card>
        </v-dialog>
    </li>
</template>

<script>
export default {
    name: 'RoutinesItem',
    props:[
        'title',
        'weeklyRoutine',
        'monthlyRoutine',
        'status'
    ],
    components:{
    },
    data(){
      return{
        editPop: false,
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
        editedWeeklyRoutine:[],
        editedRoutineTitle:'',
        editedStatus:0
      }
    },
    created(){
        this.editedWeeklyRoutine = this.weeklyRoutine
        this.editedRoutineTitle = this.title
        this.editedStatus = this.status
    },
    methods:{
        editRoutine(){
            console.log('edited')
        }
    },
    computed:{
        switchLabel(){
            if (this.editedStatus == 0){
                return 'OFF'
            }else{
                return 'ON'
            }
        }
    }

}
</script>

<style scoped>
li{
    list-style: none;
}
.relative{
    position: relative;
}
.editIcon{
    right:0;
    top:2px;
}

</style>