<template>
    <v-container relative class="pa-0 py-sm-2">
      <v-container class="pa-0">
          <v-row dense>
              <v-col cols="12"
               sm="8" offset-sm="2"  
               md="8" offset-md="0" 
               xl="6" offset-xl="2">
                  <TodoMain
                  v-if="userInfo"
                  ref="TodoMain"
                  :activeElement="activeElement"
                  :dailyTodoList="dailyTodoList"
                  :mainTodoListRecieved="mainTodoListRecieved"
                  :addedRoutine="addedRoutine"
                  @addTodo="addTodo"
                  @dragTodo="dragTodo"
                  @bulkMoveToToday="bulkMoveToToday"
                  @addComment="addComment"
                  @addRoutineItemToTodoList="addRoutineItemToTodoList"
                  @showAddRoutinePop="addRoutinePop = true"
                  @showSnackbar="showSnackbar"
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
                  :noDatesList="noDatesList"
                  @changeDate="changeDate"
                  @showSnackbar="showSnackbar"
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
import TodoSide from '../components/TodoSide.vue'
import db from '../firebaseConfig.js'
import { mapState, mapGetters } from 'vuex'

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
      displayWeekdayIndex:0,
      mainTodoListRecieved: false,
      addRoutinePop: false,
      dailyTodoList: [],
      noDatesList: [],
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
    sortedDailyTodoList(){
      let holder = this.dailyTodoList
      let list = holder.sort(
        (a,b) => a.priority - b.priority
      )
      return list
    },
    todoItemListRef(){
      return db.root.collection(`Main`).doc(`${this.uid}`).collection('todoItem')
    }
    ,
    ...mapState([
      'routine',
      'userInfo',
      'parsedDisplayDateInHyphen',
      'parsedCurrentDateInHyphen',
    ]),
    ...mapGetters([
      'parsedDisplayDateWeekday',
    ]),
  },
  created(){ 
    this.getNoDateList()
  },
  watch: {
    parsedDisplayDateInHyphen(){ //When user change date, Do the following
      this.mainTodoListRecieved = false // To hide current todos and trigger the loading effect
      if (this.uid !== ''){
        this.getTodoListByDate(this.parsedDisplayDateInHyphen)
        // this.getNoDateList()
      }
    },
    uid(){ // When user logs in, do the following
      this.getTodoListByDate(this.parsedDisplayDateInHyphen)
      this.getNoDateList()
    },
  },
  methods:{
    //Init Related
    //=======================================================
    // setDates(){
    //   this.displayWeekdayIndex = this.displayDate.getDay()
    // },
    changeDate(){
      this.displayDateKey += 1 //to force update the element in vue, this is a workaround
      // this.setDates()
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
    getTodoListByDate(date){ //Refactored 20210403
      let v = this
      this.$bind(
        'dailyTodoList',
        db.todoItems
        .where('uid', '==', v.uid)
        .where('dueTime', '==', date)
        .orderBy('creationTimeStamp','asc')
        // .orderBy('priority','desc')
      ).then( () => v.mainTodoListRecieved = true ) // set the received indicator to true
    },
    getNoDateList(){ //Added 20210419
      let v = this
      this.$bind(
        'noDatesList',
        db.todoItems
        .where('uid', '==', v.uid)
        .where('dueTime', '==', '')
        .orderBy('creationTimeStamp','desc')
      )
    },
    //Update List
    //=======================================================
    updateMainTodoListWithDate(date,todos,meta,callbackFunc){
      db.root.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(date).set(
        {
          todos: todos,
          meta: meta
        }
      ).then(callbackFunc)
    },
    //Todo Related Functions
    //=======================================================
    createNewTodoObject(title,status,todoSrc,uid = this.uid){
      let newTodoItem = {
        title: title,
        description: '',
        status: status,
        creationTimeStamp: Date.now(),
        creationTime: `${this.parsedCurrentDateInHyphen}`,
        dueTime:`${this.parsedDisplayDateInHyphen}`,
        color: '',
        priority: 0,
        src: todoSrc,
        index:'',
        uid: uid,
        deleted: false,
      }
      return newTodoItem
    },
    showSnackbar(res){
      this.$emit('showSnackbar',res)
    },
    addTodo(val){ //Refactored 20210403
      let v = this
      db.root.collection(`todoItem`).add(v.createNewTodoObject(val,1,'daily'))
      .then( () =>
          v.$emit('showSnackbar',[0,`📝 "${val}" added.`])
      )
    },
    moveToToday(res, giveFeedback = true){ //Refactored 20210403
      // let todoID = res[0]
      let title = res[1]
      let id = res[2]
      let v = this
      let targetTodoFirebaseDocRef = db.todoItems.doc(id)
      targetTodoFirebaseDocRef.update({ // update to firebase
        dueTime: v.parsedCurrentDateInHyphen
      }).then( function(){
        if (giveFeedback){
          v.$emit('showSnackbar',[2,`"${title}" moved.`])
        }}
      )
    },
    // Bulk Move to today
    bulkMoveToToday(){ //Refactored 20210403
      // 1. Get all undone todos of the day -> use this.undoneTodo
      // 2. Change the date of all items
      this.unDoneTodo.forEach( (todo) =>
        this.moveToToday(
          [
            todo.id,
            todo.title,
            todo.id,
          ],
          false
        )
      )
      // 3. Give user feedback
      this.$emit('showSnackbar',[0,`Bulk move to today succeeded.`])
    },
    // Dragging and Sorting
    dragTodo(){
      return true
    },
    //Routine
    addRoutineItemToTodoList(){
      return true
      // let counter = 0 //Routine counter, counts how many routines are added to the day
      // // Add Routine Items to local list
      // for(let i = 0 ; i<this.routine.length;i++){
      //   if(
      //     // 1.1 If the routine matches weekday
      //     this.routine[i].weeklyRoutine.indexOf(this.parsedDisplayDateWeekday) >= 0
      //     &&
      //     // 1.2 AND is turned on
      //     this.routine[i].status
      //     ){
      //     // 2. Add the routine item to today
      //     console.log(this.routine[i].title)
      //     this.addTodoWithoutUpdateToFirebase(this.routine[i].title)
      //     counter ++
      //     }
      //   }
      // if(counter === 0){ //If counter === 0 (no routine added), show hint
      //   this.$emit('showSnackbar',[2,`Theres no routine items!`])
      // }else{ //If counter!== 0, do the following
      //   // Update local list to firebase
      //   this.updateMainTodoList(
      //     // Show snackbar
      //     this.$emit('showSnackbar',[0,`🕰 Routine items added to list.`])
      //   )
      //   this.dailyTodoList.meta.addedRoutine = true
      // }
      // this.addRoutinePop = false
    },
    //Comment
    addComment(res){
      let id = res.id
      // let comment = res.comment
      // let time = res.time
      if(!this.dailyTodoList.todos[id].comments){
        this.dailyTodoList.todos[id].comments = []
      }
      return true
    },
  },
}
</script>

<style>

</style>
