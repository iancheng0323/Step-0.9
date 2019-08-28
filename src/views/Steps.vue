<template>
    <v-container relative>
      <!-- <v-layout offset-md-2> -->
        <DisplayDate  
          @changeDate="changeDate" 
          :key="displayDateKey"
          :parsedDisplayDateInSlash="parsedDisplayDateInSlash">
        </DisplayDate>
      <!-- </v-layout> -->
      <v-container grid-list-md>
          <v-layout>
              <v-flex md6>
                  <TodoMain 
                  :displayDate="displayDate" 
                  :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                  :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                  :uid="uid"
                  :activeElement="activeElement"
                  :backlog="backlog"
                  :dailyTodoList="dailyTodoList"
                  :dataRecieved="dataRecieved"
                  @addTodo="addTodo"
                  @editTodo="editTodo"
                  @changeStatus="changeStatus"
                  @deleteTodo="deleteTodo"
                  @moveToBacklog="moveToBacklog"
                  @moveToDate="moveToDate"
                  @paintColor="paintColor"
                  @moveToToday="moveToToday"
                  >
                  </TodoMain>
              </v-flex>
              <v-flex md4>
                  <TodoSide
                  :uid="uid"
                  :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                  :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                  :activeElement="activeElement"
                  :backlog="backlog"
                  @changeDate="changeDate"
                  >
                  </TodoSide>
              </v-flex>
          </v-layout>
      </v-container>
      <v-btn @click="logout" text right bottom absolute class="ma-4" color="grey">
        Logout <v-icon class="ml-2" small>fa-sign-out-alt</v-icon>
      </v-btn>
        <!-- <template v-slot:append>
        <div class="pa-2">
          <v-btn block>Logout</v-btn>
        </div>
      </template> -->
    </v-container>
    
</template>

<script>
import TodoMain from '../components/TodoMain.vue'
import DisplayDate from '../components/DisplayDate.vue'
import TodoSide from '../components/TodoSide.vue'
import db from '../firebaseConfig.js'


export default {
  name: 'Steps',
  props:[
    'userName',
    'userEmail',
    'uid',
    'auth',
  ],
  components:{
    TodoMain,
    DisplayDate,
    TodoSide,
  },
  data: function(){
    return{
      currentDate: 0,
      displayDate:0,
      displayDateKey: 0,
      parsedDisplayDateInSlash:0,
      parsedDisplayDateInHyphen:0,
      parsedCurrentDateInHyphen:0,
      activeElement: '',
      backlog:{
        todos:[]
      },
      dailyTodoList:{
        todos:[]
      },
      dataRecieved: false
    }
  },
  computed: {
    
  },
  watch: {
    parsedDisplayDateInHyphen(){
      this.dataRecieved = false
      this.dailyTodoList.todo = []
      this.datePickerValue = this.parsedDisplayDateInHyphen
      this.getMainTodoList()
      this.getBacklogTodoList()
    },
    uid(){
      this.getMainTodoList()
      this.getBacklogTodoList()
    }
  },
  created: function(){
    this.currentDate = new Date()
    this.displayDate = new Date()
    this.setDates()
    let v = this
    document.body.addEventListener('mouseup',function(){
        v.activeElement = document.activeElement.tagName
    })
  },
  methods:{
    changeDate:function(val){
      this.displayDate.setDate(this.displayDate.getDate() + val)
      this.displayDateKey += 1
      this.setDates()
    },
    setDates: function(){
      this.parsedCurrentDateInHyphen = this.parseDateInHyphen(this.currentDate)
      this.parsedDisplayDateInSlash =  this.parseDateInSlash(this.displayDate)
      this.parsedDisplayDateInHyphen = this.parseDateInHyphen(this.displayDate)
      this.datePickerValue = this.parseDateInHyphen(this.displayDate)
    },
    parseDateInHyphen: function(date){
      let yyyy = date.getFullYear()
      let mm = String(date.getMonth() + 1) //January is 0!
      let dd = String(date.getDate())
      if(mm<10){
        mm = '0' + mm
      }
      if(dd<10){
        dd = '0' + dd
      }
      return `${yyyy}-${mm}-${dd}`
    },
    parseDateInSlash: function(date){
      let yyyy = date.getFullYear()
      let mm = String(date.getMonth() + 1) //January is 0!
      let dd = String(date.getDate())
      if(mm<10){
        mm = '0' + mm
      }
      if(dd<10){
        dd = '0' + dd
      }
      return `${yyyy}/${mm}/${dd}, ${this.parseShortWeekDay(date)}`
    },
    parseWeekDay: function(date){
      switch(date.getDay()){
        case 0:
            return 'Sunday'
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
        default:
            return 'Saturday'
      }
    },
    parseShortWeekDay: function(date){
      switch(date.getDay()){
        case 0:
            return 'Sun'
        case 1:
            return 'Mon'
        case 2:
            return 'Tue'
        case 3:
            return 'Wed'
        case 4:
            return 'Thu'
        case 5:
            return 'Fri'
        default:
            return 'Sat'
      }
    },
    logout:function(){
      this.$emit('logout')
    },
    createNewTodoObject: function(title){
      let newTodoItem = {
        title: title,
        descriptopn:'',
        status: 1,
        creationTimeStamp: Date.now(),
        creationTime: `${this.parsedCurrentDateInHyphen}`,
        dueTime:`${this.parsedDisplayDateInHyphen}`,
        color: '',
      }
      return newTodoItem
    },
    getMainTodoList: function(){
      let v= this
      let dbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(v.parsedDisplayDateInHyphen)
      dbRef.get().then(function(doc){
        if(doc.exists && doc.data().todos){
          console.log(v.parsedDisplayDateInHyphen, doc.data().todos)
          v.dailyTodoList = doc.data()
          // console.log(v.dailyTodoList)
        } else{
          console.log('No doc found.')
        }
      }).catch(function(err){
        console.log(err)
      })
      v.dataRecieved = true
    },
    getBacklogTodoList: function(){
      let v= this
      let backlogDbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('backlog')      
      backlogDbRef.get().then(function(doc){
        if(doc.exists && doc.data().todos){
          console.log(v.parsedDisplayDateInHyphen, doc.data().todos)
          v.backlog = doc.data()
          // console.log(v.dailyTodoList)
        } else{
          console.log('No backlog doc found.')
        }
      }).catch(function(err){
        console.log(err)
      })
      v.dataRecieved = true
    },
    updateMainTodoList:function(){
      let v = this
      db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(v.parsedDisplayDateInHyphen).set(
        {todos: v.dailyTodoList.todos}
      ).then(function(){console.log('daily todo updated')})
    },
    updateBacklogTodoList:function(){
      let v = this
      let backlogDbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('backlog')
      backlogDbRef.set(
        {todos: v.backlog.todos}
      ).then(function(){console.log('backlog updated')})
    },
    addTodo: function(val){
      let v = this
      this.dailyTodoList.todos.push(v.createNewTodoObject(val))
      this.updateMainTodoList()
    },
    editTodo: function(res){
      let todoID = res[0]
      let eiditedTitle = res[1]
      this.dailyTodoList.todos[todoID].title = eiditedTitle
      this.updateMainTodoList()
    },
    changeStatus: function(res){
      let todoID = res[0]
      let toStatus = res[1]
      this.dailyTodoList.todos[todoID].status = toStatus
      this.updateMainTodoList()
    },
    deleteTodo: function(res){
      let todoID = res[0]
      this.dailyTodoList.todos[todoID].status = 0
      this.updateMainTodoList()
    },
    moveToBacklog:function(res){
      let v = this
      let todoID = res[0]
      let title = res[1]
      this.backlog.todos.push(v.createNewTodoObject(title))
      this.updateBacklogTodoList()
      this.dailyTodoList.todos[todoID].status = 3
      this.dailyTodoList.todos[todoID].dueDate = 'not set'
      this.updateMainTodoList()
    },
    moveToDate: function(res){
      // let todoID = res[0]
      // let toDate = res[1]
      // let v = this
      // console.log(todoID, ' moved to date', toDate)
      // db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
      //   {
      //     dueTime: toDate
      //   }
      // ).then(function(){
      //   v.showSuccessSnackbar(`"Moved to ${toDate}.`)
      // })
      console.log('moveToDate PENDING DEV')
    },
    paintColor:function(res){
      let todoID = res[0]
      let color = res[1]
      this.dailyTodoList.todos[todoID].color = color
      this.updateMainTodoList()
    },
    moveToToday:function(res){
      let todoID = res[0]
      let v = this
      // this.dailyTodoList.todos[todoID].dueTime = v.parsedCurrentDateInHyphen
      this.updateMainTodoList()
      console.log('PENDING DEV')
    },
  }
}
</script>

<style>

</style>
