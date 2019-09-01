<template>
  <v-card elevation="4" min-height="500">
    <v-container>
      <h1 class="headline my-2">Todos</h1>
      <ul v-show="dataRecieved" ref="mainTodoUl">
        <draggable 
        :list='dailyTodoList.todos' 
        handle=".dragIndicator"
        ghost-class="ghost"
        drag-class="sortable-drag"
        chosen-Class = "sortable-chosen"
        @end="dragTodo">
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
import draggable from 'vuedraggable'

export default {
  name: 'TodoMain',
  props:[
    'displayDate',
    'parsedCurrentDateInHyphen',
    'parsedDisplayDateInHyphen',
    'uid',
    'activeElement',
    'backlog',
    'dailyTodoList',
    'dataRecieved'
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
      rederedTodoItemCount: 0,
    }
  },
  watch:{
    uid: function(){
    }
  },
  computed:{
  },
  created: function(){
  },
  methods:{
    addTodo: function(val){
      this.$refs.AddTodoForm.isAddingTodo = false
      this.$emit('addTodo',val)
    },
    editTodo: function(res){
      this.$emit('editTodo',res)
    },
    changeStatus: function(res){
      this.$emit('changeStatus',res)
    },
    deleteTodo: function(res){
      this.$emit('deleteTodo',res)
    },
    moveToBacklog:function(res){
      this.$emit('moveToBacklog',res)
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
      this.$emit('moveToDate',res)
    },
    paintColor:function(res){
      this.$emit('paintColor',res)
    },
    moveToToday:function(res){
      this.$emit('moveToToday',res)
    },
    dragTodo:function(){
      this.$emit('dragTodo')
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
.sortable-drag{
    opacity: 0;
}
.sortable-chosen{
    background: rgba(12,120,120,0.2);

}
</style>
