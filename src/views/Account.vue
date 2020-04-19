<template>
  <v-container>
    <h1 class="display-2 mb-2">
        My Account
    </h1>
    <p class="subtitle-1 mb-1">Manage your accounts here.</p>
    <v-divider class="mb-4"></v-divider>
      <h2 class="headline mt-4">
        Routines
      </h2>
      <p class="subtitle-2">Manage your re-occuring tasks here.</p>
      <v-card width="400px" min-height="150px" color="white" relative>
        <v-container>
          <ul>
            <li
            is="RoutineItem"
            v-for="(item,index) in routineList"
            :routineIndex="index"
            :key="index"
            :title="item.title"
            :weeklyRoutine="item.weeklyRoutine"
            :monthlyRoutine="item.monthlyRoutine"
            :status="item.status"
            @deleteRoutine="deleteRoutine"
            @editRoutine="editRoutine"
            ></li>
          </ul>
        </v-container>
      </v-card>
      <v-btn text class="mt-2" @click="addNewRoutinePop = true">Add Routine</v-btn>
      <h2 class="headline mt-4">
        Labels
      </h2>
      <p class="subtitle-2">Manage your label here.</p>
      <ul>
        <li 
        is = "LabelItem"
        :color = "label.color"
        :text = "label.text"
        :defaultColorChoices="defaultColorChoices"
        :index="index"
        v-for="(label,index) in labels" :key="index"
        @editLable="editLable"
        @deleteLabel="deleteLabel"
        style="margin-right:8px"
        ></li>
      </ul>
      <v-btn text class="mt-2" @click="openAddNewLabelPop()">Add Label</v-btn>
      <h2 class="headline mt-4">
        Logout
      </h2>
      <p class="subtitle-2">Click <a class="link" @click="logout">here</a> to logout.</p>
      <v-dialog 
      :value="addNewRoutinePop"
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
            <v-btn @click="addNewRoutinePop = false" text class="addRoutineFormButton">Cancel</v-btn>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog 
      :value="addNewLabelPop"
      persistent
      max-width="500">
        <v-card min-height="300" relative>
          <v-card-title>Add New Label</v-card-title>
          <v-divider></v-divider>
          <v-container>
          <v-card-text>
              <v-form>
                <v-text-field
                  autofocus
                  v-model="newLabelText"
                  label="Label Name"
                  placeholder="Label Name, e.g. Urgent, Leisure, Work...">
                </v-text-field>
                <v-select
                v-model="selectedColor"
                :items="defaultColorChoices"
                label="color"
                placeholder="Set a color for the label"
                >
                </v-select>
              </v-form>
          </v-card-text>
            <v-btn @click="addNewLabel" class="addRoutineFormButton">Add</v-btn>
            <v-btn @click="closeAddNewLabelPop" text class="addRoutineFormButton">Cancel</v-btn>
          </v-container>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import db from '../firebaseConfig.js'
import RoutineItem from '../components/RoutineItem.vue'
import LabelItem from '../components/LabelItem.vue'

export default {
    name: 'Account',
    components:{
      RoutineItem,
      LabelItem
    },
    props:[
      'userName',
      'userEmail',
      'uid',
      'auth',
    ],
    data(){
      return{
        addNewRoutinePop:false,
        addNewLabelPop:false,
        routineList:{
          list:[]
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
        newLabelText: '',
        dataRecieved: false,
        defaultColorChoices:[
          {
            text: 'Red',
            value:'#E57373'
          },
          {
            text: 'Yellow',
            value:'#FDD835'
          },
          {
            text: 'Blue',
            value:'#64B5F6'
          },
          {
            text: 'Green',
            value:'#81C784'
          },
          {
            text: 'Amber',
            value:'#FFB300'
          },
          {
            text: 'Cyan',
            value:'#00BCD4'
          },
          {
            text: 'Purple',
            value:'#AB47BC'
          },
          {
            text: 'Grey',
            value:'#BDBDBD'
          },
        ],
        selectedColor: '',
        labels:[
        ],
      }
    },
    computed:{
      routineList1(){
        return this.$store.state.otherInfo.routine
      }
    },
    created(){
      this.setRoutineList()
      this.setLabelsList()
    },
    watch:{
      uid(){
        this.setRoutineList()
        this.setLabelsList()
      }
    },
    methods:{
      setLabelsList(){
        let v = this
        let dbRef = db.collection(`Main`).doc(`${this.uid}`)
        dbRef.get().then(function(doc){
          if(doc.exists){
            v.labels = doc.data().labels
          } else{
            console.log('Labels: No doc found.')
          }
        }).catch(function(err){
          console.log(err)
        })
      },
      setRoutineList(){
        let v = this
        let dbRef = db.collection(`Main`).doc(`${this.uid}`)
        dbRef.get().then(function(doc){
          if(doc.exists){
            v.routineList = doc.data().routines
          } else{
            console.log('Routine: No doc found.')
          }
          v.dataRecieved = true
        }).catch(function(err){
          console.log(err)
        })
      },
      updateRoutineList(callbackFunc){
        db.collection(`Main`).doc(`${this.uid}`).update(
          {
            routines : this.routineList
          }
        ).then(callbackFunc)
      },
      createNewRoutine(title, weeklyRoutine){
        weeklyRoutine = weeklyRoutine.sort()
        let newRoutine = {
          title: title,
          weeklyRoutine: weeklyRoutine,
          monthlyRoutine: [],
          status: true
        }
        return newRoutine
      },
      addNewRoutine(){
        if(this.newRoutineTitle.length == 0){
          console.log('empty input')
        }else{
          this.routineList.push(
            this.createNewRoutine(this.newRoutineTitle,this.selectedWeeklyRoutine)
          )
        }
        this.newRoutineTitle = ''
        this.selectedWeeklyRoutine = []
        this.addNewRoutinePop = false
        this.updateRoutineList(console.log('added Routine to firebase'))
      },
      editRoutine(res){
        let routineID = res[0]
        let editedRoutineTitle = res[1]
        let editedWeeklyRoutine = res[2].sort()
        let editedStatus = res[3]
        this.routineList.list[routineID].title = editedRoutineTitle
        this.routineList.list[routineID].weeklyRoutine = editedWeeklyRoutine
        this.routineList.list[routineID].status = editedStatus
        this.updateRoutineList(console.log('edited Routine to firebase'))        
      },
      deleteRoutine(props){
        let routineID = props[0]
        this.routineList.splice(routineID,1)
        this.updateRoutineList(console.log('deleted Routine to firebase'))        
      },
      logout(){
        this.$emit('logout')
      },
      addNewLabel(){
        if( this.newLabelText !== '' && this.selectedColor !== ''){//1. 確定提交有效
          this.labels.push(
            {
              text: this.newLabelText,
              color: this.selectedColor
            }
          )
          this.addNewLabelPop = false
          //label added toast pending adding
        }else{
          console.log('invalid submit')
        }
        //更新到firebase
        this.updateLabels()
      },
      updateLabels(){
        let ref = db.collection(`Main`).doc(`${this.uid}`)
        ref.update(
          {
            labels: this.labels
          }
        )
      },
      editLable(props){
        console.log(props)
        let index = props.index
        this.labels[index].text = props.text
        this.labels[index].color = props.color
        this.updateLabels()
      },
      deleteLabel(props){
        let index = props.index
        this.labels.splice(index,1)
        this.updateLabels()
      },
      closeAddNewLabelPop(){
        this.addNewLabelPop = false
      },
      openAddNewLabelPop(){
        this.addNewLabelPop = true
        this.selectedColor = ''
      }
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