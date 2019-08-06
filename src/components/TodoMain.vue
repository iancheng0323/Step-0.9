<template>
  <v-layout class="mt-4">
    <v-flex md12>
      <v-card elevation="10">
        <v-container>
            <h1 class="display-1 my-2">Todos</h1>
          <ul>
                <li is="TodoItem" 
                  v-for="(todo,index) in rawTodoList" 
                  :title="todo.title"
                  :key="index" 
                  :status="todo.status"
                  :todoID="todo.id"
                  @changeStatus="changeStatus"
                  @editTodo="editTodo"
                  @deleteTodo="deleteTodo"
                  ></li>
          </ul>
          <AddTodoForm v-on:addTodo="addTodo" v-if="toggleAddTodo" v-on:addTodoFail="showFailSnackbar"></AddTodoForm>
          <div v-if="!toggleAddTodo" @click="toggleAddTodo = true" class="pointer"><v-icon>add_box</v-icon> click here to add new todo</div>
          <v-snackbar v-model="showSnackbar" :timeout="2000">
            {{snackbarMessage}}
          </v-snackbar>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import TodoItem from './TodoItem.vue'
import AddTodoForm from './AddTodoForm'
import db from '../firebaseConfig.js'

export default {
  name: 'TodoMain',
  props:[
    'displayDate',
    'currentDate',
    'parsedDisplayDateInHyphen'
  ],
  components:{
    TodoItem,
    AddTodoForm
  },
  // firestore: {
  //   rawTodoList: db.collection('Todo Item'),
  // },
  data: function(){
    return{
      inputMsg:'',
      toggleAddTodo: false,
      rawTodoList: [],
      snackbarMessage: '',
      showSnackbar: false,
    }
  },
  computed:{
  },
  created: function(){
    this.$bind(
      'rawTodoList',
      db
      .collection('Todo Item')
      .where('status','<',2)
      .where('dueTime','==',this.parsedDisplayDateInHyphen)
      )
  },
  methods:{
    addTodo: function(val){
      let v = this
      db.collection('Todo Item').add( this.createNewTodoObject(val) ).then(function(){
        v.snackbarMessage = `"${val}" Added.`
        v.showSnackbar = true
      })
      this.toggleAddTodo = false
    },
    showFailSnackbar: function(message){
      this.snackbarMessage = message
      this.showSnackbar = true
      // console.log(message)
    },
    createNewTodoObject: function(title){
      let newTodoItem = {
        title: title,
        descriptopn:'',
        status: 0,
        creationTimeStamp: Date.now(),
        creationTime: `${this.currentDate.getFullYear()}-${this.currentDate.getMonth()+1}-${this.currentDate.getDate()}`,
        dueTime:`${this.currentDate.getFullYear()}-${this.currentDate.getMonth()+1}-${this.currentDate.getDate()}`,
      }
      return newTodoItem
    },
    changeStatus: function(res){
      let todoID = res[0]
      let toStatus = res[1]
      db.collection('Todo Item').doc(todoID).update(
        {
          status: toStatus
        }
      )
    },
    editTodo: function(res){
      let todoID = res[0]
      let eiditedTitle = res[1]
      db.collection('Todo Item').doc(todoID).update(
        {
          title: eiditedTitle
        }
      )
    },
    deleteTodo: function(res){
      let todoID = res[0]
      db.collection('Todo Item').doc(todoID).update(
        {
          status: 2
        }
      )
    },
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
