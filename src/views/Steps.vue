<template>
    <v-container relative>
        <StepHeader  
          @changeDate="changeDate" 
          :key="displayDateKey"
          :parsedDisplayDateInSlash="parsedDisplayDateInSlash">
        </StepHeader>
      <v-container grid-list-md>
          <v-layout>
              <v-flex md6>
                  <TodoMain 
                  ref="TodoMain"
                  :displayDate="displayDate" 
                  :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                  :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                  :uid="uid"
                  :activeElement="activeElement"
                  :backlog="backlog"
                  :dailyTodoList="dailyTodoList"
                  :mainTodoListRecieved="mainTodoListRecieved"
                  @addTodo="addTodo"
                  @editTodo="editTodo"
                  @changeStatus="changeStatus"
                  @deleteTodo="deleteTodo"
                  @moveToBacklog="moveToBacklog"
                  @moveToDate="moveToDate"
                  @paintColor="paintColor"
                  @moveToToday="moveToToday"
                  @dragTodo="dragTodo"
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
                  @addBacklogItem="addBacklogItem"
                  @editBacklogItem="editBacklogItem"
                  @deleteBacklogItem="deleteBacklogItem"
                  @moveBacklogItemToToday="moveBacklogItemToToday"
                  >
                  </TodoSide>
              </v-flex>
          </v-layout>
      </v-container>
    </v-container>
    
</template>

<script>
import TodoMain from '../components/TodoMain.vue'
import StepHeader from '../components/StepHeader.vue'
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
    StepHeader,
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
      currentWeekdayIndex:0,
      displayWeekdayIndex:0,
      activeElement: '',
      backlog:{
        todos:[]
      },
      dailyTodoList:{
        todos:[],
        meta:{
          addedRoutine: false
        }
      },
      routineList:{},
      mainTodoListRecieved: false,
      routineDataRecieved: false,
      backlogRecieved:false,
      addedRoutine:false,
    }
  },
  computed: {
  },
  watch: {
    parsedDisplayDateInHyphen(){
      this.mainTodoListRecieved = false
      this.dailyTodoList.meta.addedRoutine = false
      this.dailyTodoList.todos = []
      this.datePickerValue = this.parsedDisplayDateInHyphen
      this.setTodoListByDate(this.parsedDisplayDateInHyphen)
    },
    uid(){
      this.setTodoListByDate(this.parsedDisplayDateInHyphen)
      this.setBacklogTodoList()
    },
    // mainTodoListRecieved(){
    //   if(this.mainTodoListRecieved){
    //     this.setRoutineList()
    //   }
    // }
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
      this.displayWeekdayIndex = this.displayDate.getDay()
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
      // eslint-disable-next-line
      let yyyy = date.getFullYear()
      let mm = String(date.getMonth() + 1) //January is 0!
      let dd = String(date.getDate())
      if(mm<10){
        mm = '0' + mm
      }
      if(dd<10){
        dd = '0' + dd
      }
      // return `${yyyy}/${mm}/${dd}, ${this.parseShortWeekDay(date)}` //return all
      return `${mm}/${dd}, ${this.parseShortWeekDay(date)}` //return month, date, week day only
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
    createNewTodoObject: function(title,status,todoSrc){
      let newTodoItem = {
        title: title,
        descriptopn:'',
        status: status,
        creationTimeStamp: Date.now(),
        creationTime: `${this.parsedCurrentDateInHyphen}`,
        dueTime:`${this.parsedDisplayDateInHyphen}`,
        color: '',
        src: todoSrc
      }
      return newTodoItem
    },
    setTodoListByDate: function(date){
      let v = this
      let dbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(date)
      dbRef.get().then(function(doc){
        if(doc.exists && doc.data().todos){
          for(let i = 0; i<doc.data().todos.length; i++){
            v.dailyTodoList.todos.push(doc.data().todos[i])
            // console.log(`${doc.data().todos[i].title} added.`)
          }
        } else{
          console.log('No Todo list found.')
        }
        v.mainTodoListRecieved = true
      }).catch(function(err){
        console.log(err)
      })
    },
    setBacklogTodoList: function(){
      let v= this
      let backlogDbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('backlog')      
      backlogDbRef.get().then(function(doc){
        if(doc.exists && doc.data().todos){
          console.log('found backlog')
          v.backlog = doc.data()
        } else{
          console.log('No backlog doc found.')
        }
      }).catch(function(err){
        console.log(err)
      })
      v.backlogRecieved = true
    },
    updateMainTodoList:function(callbackFunc){
      let v = this
      this.dailyTodoList.meta.addedRoutine = this.addedRoutine
      db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(v.parsedDisplayDateInHyphen).set(
        {
          todos: v.dailyTodoList.todos,
          meta: v.dailyTodoList.meta
        }
      ).then(callbackFunc)
    },
    updateBacklogTodoList:function(callbackFunc){
      let v = this
      let backlogDbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('backlog')
      backlogDbRef.set(
        {todos: v.backlog.todos}
      ).then(callbackFunc)
    },
    addTodo: function(val){
      let v = this
      this.dailyTodoList.todos.push(v.createNewTodoObject(val,1,'daily'))
      this.updateMainTodoList(
        this.$emit('showSnackbar',[0,`📝 "${val}" added.`])
      )
    },
    editTodo: function(res){
      let todoID = res[0]
      let editedTitle = res[1]
      this.dailyTodoList.todos[todoID].title = editedTitle
      this.updateMainTodoList()
    },
    changeStatus: function(res){
      let todoID = res[0]
      let toStatus = res[1]
      this.dailyTodoList.todos[todoID].status = toStatus
      this.updateMainTodoList()
      if(toStatus == 2){ //status == 2 means is done state
        this.$emit('showSnackbar',[0,'✅ Nice job completing this task!'])
      }
    },
    deleteTodo: function(res){
      let todoID = res[0]
      let title = res[1]
      this.dailyTodoList.todos[todoID].status = 0
      this.updateMainTodoList(
        this.$emit('showSnackbar',[3,`🗑 "${title}" is deleted.`])

      )
    },
    moveToBacklog:function(res){
      let todoID = res[0]
      let title = res[1]
      // set current todo item status to 3, due date to not set
      this.dailyTodoList.todos[todoID].status = 3
      this.dailyTodoList.todos[todoID].dueDate = 'not set'
      // copy the todo item in local backlog
      this.backlog.todos.push(this.dailyTodoList.todos[todoID])
      // update changes to firebase
      this.updateBacklogTodoList()
      this.updateMainTodoList(
        this.$emit('showSnackbar',[0,`"${title}" moved to backlog.`])
      )
    },
    moveToDate: function(res){
      let todoID = res[0]
      let title = res[1]
      let toDate = res[2]
      let v = this
      let holder = { todos: [] }
      //get the todo list of the to-date
      let toDateDBRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(toDate)
      toDateDBRef.get().then(function(doc){
        if(doc.exists && doc.data().todos){
           holder = doc.data()
           holder.todos.push(v.dailyTodoList.todos[todoID])
        } else{
           holder.todos.push(v.dailyTodoList.todos[todoID])          
        }
        //update to firebase
           toDateDBRef.set({
             todos: holder.todos
           })
          //set the todo to status 3
          v.dailyTodoList.todos[todoID].status = 3
          //update to firebase
          v.updateMainTodoList(
            v.$emit('showSnackbar',[0,`${title} moved to ${toDate}.`])
          )
      }).catch(function(err){
        console.log(err)
      })
    },
    paintColor:function(res){
      let todoID = res[0]
      let color = res[1]
      this.dailyTodoList.todos[todoID].color = color
      this.updateMainTodoList()
    },
    moveToToday:function(res){
      let todoID = res[0]
      let title = res[1]
      let v = this
      let holder = { todos: [] }
      //get the todo list of the to-date
      let currentDateDBRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(this.parsedCurrentDateInHyphen)
      currentDateDBRef.get().then(function(doc){
        if(doc.exists && doc.data().todos){
           holder = doc.data()
           holder.todos.push(v.dailyTodoList.todos[todoID])
        } else{
           holder.todos.push(v.dailyTodoList.todos[todoID])          
        }
        //update to firebase
           currentDateDBRef.set({
             todos: holder.todos
           })
          //set the todo to status 3
          v.dailyTodoList.todos[todoID].status = 3
          //update to firebase
          v.updateMainTodoList(
            v.$emit('showSnackbar',[0,`${title} moved to ${v.parsedCurrentDateInHyphen}.`])            
          )
      }).catch(function(err){
        console.log(err)
      })
    },
    addBacklogItem(title){
      // let v = this
      // create a new todo item in local backlog
      let holder = this.createNewTodoObject(title, 3)
      this.backlog.todos.push(holder)
      // update changes to firebase
      this.updateBacklogTodoList()
    },
    editBacklogItem(res){
      let todoID = res[0]
      let editedTitle = res[1]
      // edit local backlog todo
      this.backlog.todos[todoID].title = editedTitle
      // update changes to firebase
      this.updateBacklogTodoList()
    },
    deleteBacklogItem(res){
      let todoID = res[0]
      // delete local backlog object
      this.backlog.todos.splice(todoID,1)
      // update changes to firebase
      this.updateBacklogTodoList()
    },
    moveBacklogItemToToday(res){
      let todoID = res[0]
      // let title = res[1]
      // set current local backlog item status to 1, due date to today
      this.backlog.todos[todoID].status = 1
      this.backlog.todos[todoID].dueDate = this.parsedDisplayDateInHyphen
      // copy the todo item in local daily todo
      this.dailyTodoList.todos.push(this.backlog.todos[todoID])
      // delete current local backlog item 
      this.backlog.todos.splice(todoID,1)
      // update changes to firebase
      this.updateBacklogTodoList()
      this.updateMainTodoList()
    },
    dragTodo(){
      this.updateMainTodoList()
    },
    setRoutineList(){
      let v = this
      let dbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('routineList')
      dbRef.get().then(function(doc){
        if(doc.exists && doc.data().list){
          v.routineList = doc.data()
          v.routineDataRecieved = true
          v.addRoutineToDailyTodoList()
        }else{
          console.log('Steps: No routine doc found.')
        }
      }).catch(function(err){
        console.log(err)
      })
    },
    addRoutineToDailyTodoList(){
      let v = this
      if(this.dailyTodoList.meta.addedRoutine){
        console.log('Routines for today are already added.')
      }else{
        for(let i = 0; i < this.routineList.list.length; i++){
          let isOn = this.routineList.list[i].status
          let isToday = this.routineList.list[i].weeklyRoutine.indexOf(this.displayWeekdayIndex) >= 0
          console.log(i,isOn,isToday)
          if( isOn && isToday){
            this.dailyTodoList.todos.push(v.createNewTodoObject(
              this.routineList.list[i].title,
              1,
              'routine'))
          }
        }
        this.dailyTodoList.meta.addedRoutine = true
        // this.updateMainTodoList()
      }
    },
  },
  created: function(){
    this.currentDate = new Date()
    this.currentWeekdayIndex = this.currentDate.getDay()    
    this.displayDate = new Date()
    this.setDates()
    let v = this
    document.body.addEventListener('mouseup',function(){
        v.activeElement = document.activeElement.tagName
    })
  },
}
</script>

<style>

</style>
