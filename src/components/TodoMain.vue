<template>
  <v-card elevation="4" min-height="500">
    <v-container>
      <h1 class="headline my-2">Todos</h1>
      <ul v-show="dataRecieved" ref="mainTodoUl">
        <draggable :model='todoList.todos' @end="dragTest">
          <li is="TodoItem" 
              v-for="(todo,index) in todoList.todos" 
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
      todoList:{
        todos:[]
      },
    }
  },
  watch:{
    parsedDisplayDateInHyphen: function(){
      this.updateDataBinding()
      this.datePickerValue = this.parsedDisplayDateInHyphen
    },
    uid: function(){
    // this.bindToFirebase()
    this.getFirebaseData()
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
    getFirebaseData: function(){
      let v= this
      let dbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(v.parsedDisplayDateInHyphen)
      dbRef.get().then(function(doc){
        if(doc.exists && doc.data().todos){
          console.log(doc.data().todos)
          v.todoList = doc.data()
          console.log(v.todoList)
        } else{
          console.log('No doc found.')
        }
      }).catch(function(err){
        console.log(err)
      })
      v.dataRecieved = true
    },
    updateFirebaseTodo:function(){
      let v = this
      db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(v.parsedDisplayDateInHyphen).set(
        {todos: v.todoList.todos}
      ).then(function(){console.log('updated')})
    },
    addTodo: function(val){
      let v = this
      this.todoList.todos.push(v.createNewTodoObject(val))
      this.$refs.AddTodoForm.isAddingTodo = false
      this.updateFirebaseTodo()
    },
    editTodo: function(res){
      let todoID = res[0]
      let eiditedTitle = res[1]
      this.todoList.todos[todoID].title = eiditedTitle
      this.updateFirebaseTodo()
      // db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
      //   {
      //     title: eiditedTitle
      //   }
      // )
    },
    changeStatus: function(res){
      let todoID = res[0]
      let toStatus = res[1]
      this.todoList.todos[todoID].status = toStatus
      this.updateFirebaseTodo()
      // db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
      //   {
      //     status: toStatus
      //   }
      // )
    },
    deleteTodo: function(res){
      let todoID = res[0]
      let title = res[1]
      // let v = this
      this.todoList.todos[todoID].status = 0
      this.updateFirebaseTodo()
      this.showNeutralSnackbar(`"${title}" Deleted.`)
      // db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
      //   {
      //     status: 0
      //   }
      // ).then(function(){
      //   v.showNeutralSnackbar(`"${title}" Deleted.`)
      // })
    },
    moveToBacklog:function(res){
      let todoID = res[0]
      let title = res[1]
      // let v = this
      this.todoList.todos[todoID].status = 3
      this.todoList.todos[todoID].dueDate = 'not set'
      this.updateFirebaseTodo()
      this.showSuccessSnackbar(`"${title}" moved to backlog.`)
      // db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
      //   {
      //     status: 3,
      //     dueDate: 'not set'
      //   }
      // ).then(function(){
      //   v.showSuccessSnackbar(`"${title}" moved to backlog.`)
      // })
    },
    updateDataBinding: function(){
      this.$unbind('todoList')
      this.dataRecieved = false
      this.bindToFirebase()
    },
    bindToFirebase: function(){
      let v = this
      this.$bind(
      'todoList',
      db
      .collection('Main')
      .doc(`${this.uid}`)
      .collection('todoItem')
      .doc(this.parsedDisplayDateInHyphen)
      // .orderBy('creationTimeStamp','desc')
      ).then(function(doc){
        if(doc){
          console.log('Todo-main data received')
          v.dataRecieved = true
        }else{
          v.todoList = {
            todos:[]
          }
        }
        })
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
