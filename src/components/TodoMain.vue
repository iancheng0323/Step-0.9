<template>
  <v-card elevation="4" min-height="500">
    <v-container>
      <h1 class="headline my-2">Todos</h1>
      <ul v-show="dataRecieved" ref="mainTodoUl">
        <draggable :model='dailyTodoList.todos' @end="dragTest">
          <li is="TodoItem" 
              v-for="(todo,index) in dailyTodoList.todos" 
              :title="todo.title"
              :key="index" 
              :status="todo.status"
              :todoID="index"
              :activeElement="activeElement"
              :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
              :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
              :color="todo.color"
              @changeStatus="changeStatus"
              @editTodo="editTodo"
              @deleteTodo="deleteTodo"
              @moveToBacklog="moveToBacklog"
              @moveToDate="moveToDate"
              @paintColor="paintColor"
              @moveToToday="moveToToday"
              ></li>
        </draggable>
      </ul>
      <p v-if="rederedTodoItemCount == 0 && dataRecieved" class="grey--text">There's nothing to do on this day. <span class="font-weight-bold">Yet.</span></p>
      <v-progress-linear indeterminate color="#888" v-show="!dataRecieved"></v-progress-linear>
      <AddTodoForm 
        @addTodo="addTodo"
        @addTodoFail="showErrorSnackbar"
        @toggleAddTodo="toggleAddTodo"
        ref="AddTodoForm"
        v-if="dataRecieved"
      ></AddTodoForm>
      <v-snackbar v-model="showSnackbar" :timeout="2000" :color="snackbarColor">
        {{snackbarMessage}}
      </v-snackbar>
    </v-container>
  </v-card>
</template>

<script>
import TodoItem from './TodoItem.vue'
import AddTodoForm from './AddTodoForm'
import db from '../firebaseConfig.js'
import draggable from 'vuedraggable'

export default {
  name: 'TodoMain',
  props:[
    'displayDate',
    'parsedCurrentDateInHyphen',
    'parsedDisplayDateInHyphen',
    'uid',
    'activeElement',
  ],
  components:{
    TodoItem,
    AddTodoForm,
    draggable
  },
  data: function(){
    return{
      inputMsg:'',
      rawTodoList: [],
      snackbarMessage: '',
      showSnackbar: false,
      snackbarColor: '',
      dataRecieved: false,
      rederedTodoItemCount: 0,
      backlog:{
        todos:[]
      },
      dailyTodoList:{
        todos:[]
      },
    }
  },
  watch:{
    parsedDisplayDateInHyphen: function(){
      // this.updateDataBinding()
      this.dataRecieved = false
      this.dailyTodoList.todo = []
      this.datePickerValue = this.parsedDisplayDateInHyphen
      this.getMainTodoList()
    },
    uid: function(){
      this.getMainTodoList()
    }
  },
  computed:{
  },
  created: function(){
    // this.bindToFirebase()
  },
  methods:{
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
      this.$refs.AddTodoForm.isAddingTodo = false
      this.updateMainTodoList()
      this.showSuccessSnackbar(`"${val}" added.`)
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
      let title = res[1]
      this.dailyTodoList.todos[todoID].status = 0
      this.updateMainTodoList()
      this.showNeutralSnackbar(`"${title}" Deleted.`)
    },
    moveToBacklog:function(res){
      let v = this
      let todoID = res[0]
      let title = res[1]
      let backlogDbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('backlog')
      this.backlog.todos.push(v.createNewTodoObject(title))
      this.updateBacklogTodoList()
      this.dailyTodoList.todos[todoID].status = 3
      this.dailyTodoList.todos[todoID].dueDate = 'not set'
      this.updateMainTodoList()
      this.showSuccessSnackbar(`"${title}" moved to backlog.`)
    },
    toggleAddTodo: function(){
      this.isAddingTodo = !this.isAddingTodo
    },
    showSuccessSnackbar:function(message){
      this.snackbarMessage = message
      this.snackbarColor = 'success'
      this.showSnackbar = true
    },
    showNeutralSnackbar:function(message){
      this.snackbarMessage = message
      this.snackbarColor = ''
      this.showSnackbar = true
    },
    showErrorSnackbar: function(message){
      this.snackbarMessage = message
      this.snackbarColor = 'error'
      this.showSnackbar = true
    },
    countRenderedTodoItem: function(){
      this.rederedTodoItemCount = this.$refs.mainTodoUl.childElementCount
    },
    moveToDate: function(res){
      let todoID = res[0]
      let toDate = res[1]
      let v = this
      console.log(todoID, ' moved to date', toDate)
      db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
        {
          dueTime: toDate
        }
      ).then(function(){
        v.showSuccessSnackbar(`"Moved to ${toDate}.`)
      })
    },
    paintColor:function(res){
      let todoID = res[0]
      let color = res[1]
      db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
        {
          color: color
        }
      )
    },
    moveToToday:function(res){
      let todoID = res[0]
      let v = this
      db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
        {
          dueTime: v.parsedCurrentDateInHyphen
        }
      ).then(function(){
        v.showSuccessSnackbar(`"Moved to ${v.parsedCurrentDateInHyphen}.`)
      })
    },
    dragTest:function(evt){
      console.log(evt)
    },
  },
  updated:function(){
    this.countRenderedTodoItem()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul{
  margin-left: 0!important;
  padding-left: 0!important;
}
.pointer {
  cursor: pointer;
}
</style>
