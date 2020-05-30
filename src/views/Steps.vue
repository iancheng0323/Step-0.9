<template>
    <v-container relative class="pa-0 py-sm-2">
        <!-- <StepHeader  
          @changeDate="changeDate"
          @addRoutineItemToTodoList="addRoutineItemToTodoList"
          @showAddRoutinePop="showAddRoutinePop"
          :addedRoutine="dailyTodoList.meta.addedRoutine"
          :key="displayDateKey"
          :displayDate="displayDate">
        </StepHeader> -->
      <v-container class="pa-0">
          <v-row dense>
              <v-col cols="12"
               sm="8" offset-sm="2"  
               md="8" offset-md="0" 
               xl="6" offset-xl="2">
                  <TodoMain 
                  ref="TodoMain"
                  :displayDate="displayDate"
                  :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                  :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                  :activeElement="activeElement"
                  :dailyTodoList="dailyTodoList"
                  :mainTodoListRecieved="mainTodoListRecieved"
                  :addedRoutine="addedRoutine"
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
                  @addComment="addComment"
                  @addRoutineItemToTodoList="addRoutineItemToTodoList"
                  @showAddRoutinePop="addRoutinePop = true"
                  >
                  </TodoMain>
              </v-col>
              <v-col 
              cols="12" 
              md="4" offset-md="0"
              sm="8" offset-sm="2" 
              xl="2">
                  <TodoSide
                  :uid="uid"
                  :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                  :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                  :activeElement="activeElement"
                  @changeDate="changeDate"
                  >
                  </TodoSide>
              </v-col>
          </v-row>
      </v-container>
      <v-dialog
            v-model="addRoutinePop"
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Add routine to today?</v-card-title>
                <v-card-text class="body-1">We noticed that you have added Your Routine to this date, do you still want to add routine?</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      class="grey--text"
                      text
                      @click="addRoutineItemToTodoList"
                  >
                      Add Routine
                  </v-btn>
                  <v-btn
                      color="primary--text"
                      text
                      @click="addRoutinePop = false"
                  >
                      No
                  </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import TodoMain from '../components/TodoMain.vue'
// import StepHeader from '../components/StepHeader.vue'
import TodoSide from '../components/TodoSide.vue'
import db from '../firebaseConfig.js'


export default {
  name: 'Steps',
  props:[
    'userName',
    'userEmail',
    'uid',
    'auth',
    'activeElement'
  ],
  components:{
    TodoMain,
    // StepHeader,
    TodoSide,
  },
  data(){
    return{
      addedRoutine:false,
      displayDateKey: 0,
      parsedDisplayDateInHyphen:0,
      parsedCurrentDateInHyphen:0,
      displayWeekdayIndex:0,
      mainTodoListRecieved: false,
      addRoutinePop: false,
      dailyTodoList: []
    }
  },
  computed: {
    unDoneTodo(){
      let list = []
      for(let i = 0;i<this.dailyTodoList.length;i++){
        if(this.dailyTodoList[i].status == 1){//status == 1 indicates undone todo
          list.push(this.dailyTodoList[i])
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
      return this.$store.state.otherInfo.routines
    },
    parsedDisplayDateWeekday(){
      return this.$store.getters.parsedDisplayDateWeekday
    },
    todoItemListRef(){
      return db.collection(`Main`).doc(`${this.uid}`).collection('todoItem')
    }
  },
  watch: {
    parsedDisplayDateInHyphen(){
      this.mainTodoListRecieved = false
      if(this.uid !== ''){
        this.setTodoListByDate(this.parsedDisplayDateInHyphen)
      }
    },
    uid(){
      this.setTodoListByDate(this.parsedDisplayDateInHyphen)
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
        comments:[],
        status: status,
        creationTimeStamp: Date.now(),
        creationTime: `${this.parsedCurrentDateInHyphen}`,
        dueTime:`${this.parsedDisplayDateInHyphen}`,
        color: '',
        src: todoSrc,
        index:'',
      }
      return newTodoItem
    },
    setTodoListByDate(date){
      let v = this
      // let dbRef = this.todoItemListRef.doc(date)
      this.$bind('dailyTodoList',
        db.collection(`Main`).doc(`${this.uid}`).collection('todoItem')
        .where('dueTime', '==', date)
        .where('status', '>', 0)
      ).then( () => v.mainTodoListRecieved = true ) // set the received indicator to true
    },
    // eslint-disable-next-line
    updateMainTodoList(callbackFunc){
      return true // in case something went wrong
      // db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(v.parsedDisplayDateInHyphen).set(
      //   v.dailyTodoList
      // ).then(callbackFunc)
    },
    updateMainTodoListWithDate(date,todos,meta,callbackFunc){
      db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(date).set(
        {
          todos: todos,
          meta: meta
        }
      ).then(callbackFunc)
    },
    addTodo(val){
      let v = this
      // v.dailyTodoList.todos.push(v.createNewTodoObject(val,1,'daily'))// Add Data To Local
      this.todoItemListRef.add(v.createNewTodoObject(val,1,'daily')) //Add Data to Firebase
      .then( function(){
          v.$emit('showSnackbar',[0,`📝 "${val}" added.`])   
        }
      )
    },
    addTodoWithoutUpdateToFirebase(val){
      let v = this
      this.dailyTodoList.todos.push(v.createNewTodoObject(val,1,'daily'))
    },
    editTodo(res){
      // let todoID = res[0]
      let editedTitle = res[1]
      let id = res[2]
      let targetTodoFirebaseDocRef = this.todoItemListRef.doc(id)
      // this.dailyTodoList.todos[todoID].title = editedTitle // update local
      targetTodoFirebaseDocRef.update({ // update to firebase
        title: editedTitle
      })
    },
    changeStatus(res){
      // let todoID = res[0]
      let toStatus = res[1]
      let id = res[2]
      let targetTodoFirebaseDocRef = this.todoItemListRef.doc(id)
      targetTodoFirebaseDocRef.update({ // update to firebase
        status: toStatus
      })
      if(toStatus == 2){ //status == 2 means is done state
        this.$emit('showSnackbar',[0,'✅ Nice job completing this task!'])
      }
    },
    deleteTodo(res){
      // let todoID = res[0]
      let title = res[1]
      let id = res[2]
      let targetTodoFirebaseDocRef = this.todoItemListRef.doc(id)
      targetTodoFirebaseDocRef.update({ // update to firebase
        status: 0
      })
      this.$emit('showSnackbar',[3,`"${title}" is deleted.`])
    },
    moveToDate(res){
      // let todoID = res[0]
      let title = res[1]
      let toDate = res[2]
      let id = res[3]
      if(toDate === this.parsedDisplayDateInHyphen){//handle situation where user may move the todo to the same day it was already on
        this.$emit('showSnackbar',[2,"⚠️ Can't move to the same date."])
      }else{
        let targetTodoFirebaseDocRef = this.todoItemListRef.doc(id)
        targetTodoFirebaseDocRef.update({ // update to firebase
          dueTime: toDate
        }).then(
          this.$emit('showSnackbar',[0,`"${title}" moved.`])
        )
      }
    },
    paintColor(res){
      // let todoID = res[0]
      let color = res[1]
      let id = res[2]
      let targetTodoFirebaseDocRef = this.todoItemListRef.doc(id)
      targetTodoFirebaseDocRef.update({ // update to firebase
        color: color
      })
    },
    moveToToday(res){
      // let todoID = res[0]
      let title = res[1]
      let id = res[2]
      let v = this
      let targetTodoFirebaseDocRef = this.todoItemListRef.doc(id)
      targetTodoFirebaseDocRef.update({ // update to firebase
        dueTime: v.parsedCurrentDateInHyphen
      }).then(
        this.$emit('showSnackbar',[2,`"${title}" moved.`])
      )
    },
    bulkMoveToToday(){
      let v = this
      let holder = []
      //1. Get all undone todos of the day -> use this.undoneTodo
      //2. Move the undones to target date list(local)
      //2.1 Get target date list
      let currentDateDBRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(this.parsedCurrentDateInHyphen)
      currentDateDBRef.get().then( doc => {
        if(doc.exists && doc.data().todos){ // If there is existing todos in the target date,
          // Fill holder with the todos of the day
          holder = doc.data().todos
        }
        // Push undone todos to holder
        v.unDoneTodo.forEach( todo => { 
          holder.push( todo )
        })
        console.log(holder)
        //3. Update the change of the to-date to firebase
        v.updateMainTodoListWithDate(
          v.parsedCurrentDateInHyphen,
          holder,
          {addedRoutine: false},
          this.$emit('showSnackbar',[0,`Bulk move to today succeeded.`])
        )
        //4. Change undone todo status to deleted(status code: 3) locally
        v.unDoneTodo.forEach( todo => { 
          todo.status = 3
        })
        //5. Update the change of the from-date to firebase
        v.updateMainTodoListWithDate(
          v.parsedDisplayDateInHyphen,
          v.dailyTodoList.todos,
          {addedRoutine: false},
        )
      })
    },
    dragTodo(){
      this.updateMainTodoList()
    },
    addRoutineItemToTodoList(){
      let counter = 0 //Routine counter, counts how many routines are added to the day
      // Add Routine Items to local list
      for(let i = 0 ; i<this.routine.length;i++){
        if(
          // 1.1 If the routine matches weekday
          this.routine[i].weeklyRoutine.indexOf(this.parsedDisplayDateWeekday) >= 0
          &&
          // 1.2 AND is turned on
          this.routine[i].status
          ){
          // 2. Add the routine item to today
          console.log(this.routine[i].title)
          this.addTodoWithoutUpdateToFirebase(this.routine[i].title)
          counter ++
          }
        }
      if(counter === 0){ //If counter === 0 (no routine added), show hint
        this.$emit('showSnackbar',[2,`Theres no routine items!`])
      }else{ //If counter!== 0, do the following
        // Update local list to firebase
        this.updateMainTodoList(
          // Show snackbar
          this.$emit('showSnackbar',[0,`🕰 Routine items added to list.`])
        )
        this.dailyTodoList.meta.addedRoutine = true
      }
      this.addRoutinePop = false
    },
    addComment(res){
      // Res Description
      // res:{
      //   id: id // Number
      //   comment: comment //String
      //   time: time // Number, unix time stamp
      // }
      let id = res.id
      let comment = res.comment
      let time = res.time
      if(!this.dailyTodoList.todos[id].comments){
        this.dailyTodoList.todos[id].comments = []
      }
      this.dailyTodoList.todos[id].comments.push({
        comment: comment,
        time: time
      })
      this.updateMainTodoList()
    },
    moveToBacklog(res){
      let title = res[1]
      let id = res[2]
      let targetTodoFirebaseDocRef = this.todoItemListRef.doc(id)
      targetTodoFirebaseDocRef.update({ // update to firebase
        dueTime: ''
      }).then(
        this.$emit('showSnackbar',[0,`"${title}" moved to backlog.`])
      )
    },
  },
  created(){ 
    this.setDates()
  },
}
</script>

<style>

</style>
