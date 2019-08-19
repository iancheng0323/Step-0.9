<template>
  <v-card elevation="4" min-height="500">
    <v-container>
      <h1 class="headline my-2">Todos</h1>
      <ul v-show="dataRecieved" ref="mainTodoUl">
        <draggable :model='rawTodoList' @end="dragTest">
          <li is="TodoItem" 
              v-for="(todo,index) in rawTodoList" 
              :title="todo.title"
              :key="index" 
              :status="todo.status"
              :todoID="todo.id"
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
    }
  },
  watch:{
    parsedDisplayDateInHyphen: function(){
      this.updateDataBinding()
      this.datePickerValue = this.parsedDisplayDateInHyphen
    },
    uid: function(){
    this.bindToFirebase()
    }
  },
  computed:{
    
  },
  created: function(){
    this.bindToFirebase()
  },
  methods:{
    addTodo: function(val){
      let v = this
      db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc(v.parsedDisplayDateInHyphen).set(
        // db.collection(`todoItem`).doc(`${this.uid}`).collection('all').add(
            v.createNewTodoObject(val)
          ,{merge: false}
        ).then(function(){
        v.showSuccessSnackbar(`"${val}" Added.`)
      })
      this.$refs.AddTodoForm.isAddingTodo = false
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
    changeStatus: function(res){
      let todoID = res[0]
      let toStatus = res[1]
      db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
        {
          status: toStatus
        }
      )
    },
    editTodo: function(res){
      let todoID = res[0]
      let eiditedTitle = res[1]
      db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
        {
          title: eiditedTitle
        }
      )
    },
    deleteTodo: function(res){
      let todoID = res[0]
      let title = res[1]
      let v = this
      db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
        {
          status: 0
        }
      ).then(function(){
        v.showNeutralSnackbar(`"${title}" Deleted.`)
      })
    },
    moveToBacklog:function(res){
      let todoID = res[0]
      let title = res[1]
      let v = this
      db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
        {
          status: 3,
          dueDate: 'not set'
        }
      ).then(function(){
        v.showSuccessSnackbar(`"${title}" moved to backlog.`)
      })
    },
    updateDataBinding: function(){
      this.$unbind('rawTodoList')
      this.dataRecieved = false
      this.bindToFirebase()
    },
    bindToFirebase: function(){
      let v = this
      this.$bind(
      'rawTodoList',
      db
      .collection('todoItem')
      .doc(`${this.uid}`)
      .collection('all')
      .where('dueTime','==',this.parsedDisplayDateInHyphen)
      .orderBy('creationTimeStamp','desc')
      ).then(function(){
        console.log('Todo-main data received')
        v.dataRecieved = true
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
