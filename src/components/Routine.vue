<template>
    <v-card width="400px" min-height="150px" relative outlined>
        <v-container>
          <ul>
            <v-list-item class="relative mt-3" ripple="true" two-line 
            v-for="(item,index) in routineList" :key="index">
                <v-list-item-content>
                    <h3 class="title">{{item.title}}</h3>
                    <v-btn
                    icon
                    absolute
                    small
                    class="editIcon"
                    @click="editPop=true"
                    >
                        <v-icon small>edit</v-icon>
                    </v-btn>
                    <p class="subtitle-2">{{routineDes}}</p>
                </v-list-item-content>
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
                            <v-btn @click="deleteRoutine" class="editRoutineFormButton">Delete</v-btn>
                            </v-form>
                        </v-card-text>
                        <v-btn @click="editRoutine" class="editRoutineFormButton">Edit</v-btn>
                        <v-btn @click="editPop = false" text class="editRoutineFormButton">Discard</v-btn>
                    </v-container>
                    </v-card>
                </v-dialog>
            </v-list-item>
        </ul>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: 'Routine',
    props:[
        'routineIndex',
        'weeklyRoutine',
        'monthlyRoutine',
        'status',
        'routineList'
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
        editedStatus:true
      }
    },
    created(){
        this.editedWeeklyRoutine = this.weeklyRoutine
        this.editedRoutineTitle = this.routineList
        this.editedStatus = this.status
    },
    methods:{
        editRoutine(){
            this.editPop = false
            this.$emit('editRoutine',[this.routineIndex,this.editedRoutineTitle,this.editedWeeklyRoutine,this.editedStatus])
        },
        deleteRoutine(){
            this.editPop = false
            this.$emit('deleteRoutine',[this.routineIndex])
        },
        translateWeekday(n){
            let day = ''
            switch (n) {
                case 0:
                    day = "Sunday"
                    break
                case 1:
                    day = "Monday"
                    break
                case 2:
                    day = "Tuesday"
                    break
                case 3:
                    day = "Wednesday"
                    break
                case 4:
                    day = "Thursday"
                    break
                case 5:
                    day = "Friday"
                    break
                case 6:
                    day = "Saturday"
            }
            return day
        }
    },
    computed:{
        switchLabel(){
            if (this.editedStatus == false){
                return 'Status: OFF'
            }else{
                return 'Status: ON'
            }
        },
        routineDes(){
            let m = 'On every '
            for(let i=0;i<this.weeklyRoutine.length;i++){
                m += this.translateWeekday(this.weeklyRoutine[i])
                if(i<this.weeklyRoutine.length-1){
                    m += ', '
                }else{
                    m +='.'
                }
            }
            return m
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
.editRoutineFormButton{
    margin-right: 10px;
}
</style>