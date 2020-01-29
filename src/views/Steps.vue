<template>
    <v-container relative>
        <StepHeader  
          @changeDate="changeDate"
          @addRoutineItemToTodoList="addRoutineItemToTodoList"
          :key="displayDateKey"
          :displayDate="displayDate">
        </StepHeader>
      <v-container grid-list-md>
          <v-layout>
              <v-flex md6>
                  <TodoMain 
                  ref="TodoMain"
                  :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                  :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                  :activeElement="activeElement"
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
                  @bulkMoveToToday="bulkMoveToToday"
                  >
                  </TodoMain>
              </v-flex>
              <v-flex md4>
                  <TodoSide
                  :uid="uid"
                  :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                  :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                  :activeElement="activeElement"
                  @changeDate="changeDate"
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
  data(){
    return{
      displayDateKey: 0,
      parsedDisplayDateInHyphen:0,
      parsedCurrentDateInHyphen:0,
      displayWeekdayIndex:0,
      activeElement: '',
      dailyTodoList:{
        todos:[],
        meta:{
          addedRoutine: false
        }
      },
      mainTodoListRecieved: false,
      addedRoutine:false,
    }
  },
  computed: {
    unDoneTodo(){
      let list = []
      for(let i = 0;i<this.dailyTodoList.todos.length;i++){
        if(this.dailyTodoList.todos[i].status == 1){//status == 1 indicates undone todo
          list.push(this.dailyTodoList.todos[i])
        }
      }
      return list
    },
    unDoneTodoIndex(){
      let list = []
      for(let i = 0;i<this.dailyTodoList.todos.length;i++){
        if(this.dailyTodoList.todos[i].status == 1){//status == 1 indicates undone todo
          list.push(i)
        }
      }
      return list
    },
    currentDate(){
      return this.$store.state.currentDate
    },
    currentWeekdayIndex(){
      return this.$store.state.currentWeekdayIndex
    },
    displayDate(){
      return this.$store.state.displayDate
    },
    routine(){
      return this.$store.state.routine
    },
    parsedDisplayDateWeekday(){
      return this.$store.getters.parsedDisplayDateWeekday
    }
  },
  watch: {
    parsedDisplayDateInHyphen(){
      this.mainTodoListRecieved = false
      this.dailyTodoList.meta.addedRoutine = false
      this.dailyTodoList.todos = []
      this.datePickerValue = this.parsedDisplayDateInHyphen
      if(this.uid !== ''){
        this.setTodoListByDate(this.parsedDisplayDateInHyphen)
      }
    },
    uid(){
      this.setTodoListByDate(this.parsedDisplayDateInHyphen)
      this.setBacklogTodoList()
      this.setRoutineList()
    },
  },
  methods:{
    changeDate(){
      this.displayDateKey += 1 //to force update the element in vue, this is a workaround
      this.setDates()
    },
    setDates(){
      this.parsedCurrentDateInHyphen = this.parseDateInHyphen(this.currentDate)
      this.parsedDisplayDateInHyphen = this.parseDateInHyphen(this.displayDate)
      this.displayWeekdayIndex = this.displayDate.getDay()
      this.datePickerValue = this.parseDateInHyphen(this.displayDate)
    },
    parseDateInHyphen(date){
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
    createNewTodoObject(title,status,todoSrc){
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
    setTodoListByDate(date){
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
    setBacklogTodoList(){
      // Initiate vuex getBacklogFromFirebase function
      this.$store.dispatch('getBacklogFromFirebase')
    },
    setRoutineList(){
      // Initiate vuex getRoutineFromFirebase function
      this.$store.dispatch('getRoutineFromFirebase')
    },
    updateMainTodoList(callbackFunc){
      let v = this
      this.dailyTodoList.meta.addedRoutine = this.addedRoutine
      db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(v.parsedDisplayDateInHyphen).set(
        {
          todos: v.dailyTodoList.todos,
          meta: v.dailyTodoList.meta
        }
      ).then(callbackFunc)
    },
    addTodo(val){
      let v = this
      this.dailyTodoList.todos.push(v.createNewTodoObject(val,1,'daily'))
      this.updateMainTodoList(
        this.$emit('showSnackbar',[0,`📝 "${val}" added.`])
      )
    },
    addTodoWithoutUpdateToFirebase(val){
      let v = this
      this.dailyTodoList.todos.push(v.createNewTodoObject(val,1,'daily'))
    },
    editTodo(res){
      let todoID = res[0]
      let editedTitle = res[1]
      this.dailyTodoList.todos[todoID].title = editedTitle
      this.updateMainTodoList()
    },
    changeStatus(res){
      let todoID = res[0]
      let toStatus = res[1]
      this.dailyTodoList.todos[todoID].status = toStatus
      this.updateMainTodoList()
      if(toStatus == 2){ //status == 2 means is done state
        this.$emit('showSnackbar',[0,'✅ Nice job completing this task!'])
      }
    },
    deleteTodo(res){
      let todoID = res[0]
      let title = res[1]
      this.dailyTodoList.todos[todoID].status = 0
      this.updateMainTodoList(
        this.$emit('showSnackbar',[3,`🗑 "${title}" is deleted.`])

      )
    },
    moveToBacklog(res){
      // let todoID = res[0]
      let title = res[1]
      // set current todo item status to 3, due date to not set
      // this.dailyTodoList.todos[todoID].status = 3
      // this.dailyTodoList.todos[todoID].dueDate = 'not set'
      // copy the todo item in local backlog
      // this.backlog.todos.push(this.dailyTodoList.todos[todoID])
      // update changes to firebase
      // this.updateBacklogTodoList()
      // this.updateMainTodoList(
        this.$emit('showSnackbar',[0,`"${title}" moved to backlog.`])
      // )
    },
    moveToDate(res){
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
    paintColor(res){
      let todoID = res[0]
      let color = res[1]
      this.dailyTodoList.todos[todoID].color = color
      this.updateMainTodoList()
    },
    moveToToday(res){
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
    dragTodo(){
      this.updateMainTodoList()
    },
    bulkMoveToToday(){
      let v = this
      let holder = { todos: [] }
      //get the todo list of the to-date
      let currentDateDBRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(this.parsedCurrentDateInHyphen)
      currentDateDBRef.get().then(function(doc){
        //push the undones to the list
        if(doc.exists && doc.data().todos){
           holder = doc.data()
           for(let i = 0; i<v.unDoneTodo.length; i++){
              holder.todos.push(v.unDoneTodo[i])
              // console.log(v.unDoneTodo[i])
           }
        } else{
           for(let i = 0; i<v.unDoneTodo.length; i++){
              holder.todos.push(v.unDoneTodo[i])             
           }         
        }
        //update to firebase
           currentDateDBRef.set({
             todos: holder.todos
           })
          //set the todo to status 3
          for (let i = 0; i<v.unDoneTodoIndex.length; i++){
            v.dailyTodoList.todos[v.unDoneTodoIndex[i]].status = 3
          }
          //update to firebase
          v.updateMainTodoList(
            v.$emit('showSnackbar',[0,`Undone todos moved to today 😉`])            
          )
      }).catch(function(err){
        console.log(err)
      })
    },
    addRoutineItemToTodoList(){
      // Add Routine Items to local list
      for(let i = 0 ; i<this.routine.list.length;i++){
        if(
          // 1.1 If the routine matches weekday
          this.routine.list[i].weeklyRoutine.indexOf(this.parsedDisplayDateWeekday) > 0
          &&
          // 1.2 AND is turned on
          this.routine.list[i].status
          ){
          // 2. Add the routine item to today
          console.log(this.routine.list[i].title)
          this.addTodoWithoutUpdateToFirebase(this.routine.list[i].title)
        }
      }
      // Update local list to firebase
      this.updateMainTodoList(
        // Show snackbar
        this.$emit('showSnackbar',[0,`🕰 Routine items added to list.`])
      )
    }
  },
  created(){ 
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
