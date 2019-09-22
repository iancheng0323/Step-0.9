<template>
  <v-card min-height="500" class="pb-12">
    <v-container class="px-0">
      <!-- <h1 class="headline my-2">Todos</h1> -->
      <ul v-show="mainTodoListRecieved" class="mt-2" ref="mainTodoUl">
        <draggable 
        :list='dailyTodoList.todos' 
        handle=".dragIndicator"
        ghost-class="ghost"
        drag-class="sortable-drag"
        chosen-Class = "sortable-chosen"
        @end="dragTodo"
        >
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
      <p v-if="totalItemCount == 0 && mainTodoListRecieved" class="ml-4 grey--text">Create Your First Item For Today.</p>
      <v-progress-linear indeterminate color="#888" v-show="!mainTodoListRecieved"></v-progress-linear>
    </v-container>
    <v-container>
      <AddTodoForm 
        @addTodo="addTodo"
        @addTodoFail="showAddTodoFailSnackbar"
        ref="AddTodoForm"
        v-if="mainTodoListRecieved"
        v-shortkey="['ctrl', 'n']" 
        @shortkey.native="toggleAddTodo"
      ></AddTodoForm>
    </v-container>
    <div class="bottomHint">
      <span class="progressHint" v-if="doneItemCount == totalItemCount && totalItemCount != 0">
        <!-- <v-icon size="12" color="#4CAF50" class="progressHintIcon">favorite</v-icon>  -->
        🎉 Congratulations! You've finished your todos for today.
      </span>
      <span class="progressHint" v-else>
        💪{{doneItemCount}}/{{totalItemCount}} Done 
        <span v-if="totalItemCount != 0">({{Math.floor((doneItemCount/totalItemCount) * 100)}}%)</span>
        <span v-if="doneItemCount<totalItemCount && parsedCurrentDateInHyphen !=parsedDisplayDateInHyphen"> | </span>
        <a 
        class="moveToTodayButton" 
        href="javascript:void(0)"
        @click="bulkMoveToToday"
        v-if="doneItemCount<totalItemCount && parsedCurrentDateInHyphen !=parsedDisplayDateInHyphen">
          📤 Move undones to next day(in-dev)</a>
      </span>
      </div>
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
    'mainTodoListRecieved'
  ],
  components:{
    TodoItem,
    AddTodoForm,
    draggable
  },
  data: function(){
    return{
      inputMsg:'',
      rederedTodoItemCount: 0,
    }
  },
  watch:{
    uid: function(){
    }
  },
  computed:{
    doneItemCount(){
      let count = 0
      let todoList = this.dailyTodoList.todos
      for(let i=0;i<todoList.length;i++){
        if(todoList[i].status == 2){ //status == 2 indicate checked
          count += 1
        }
      }
      return count
    },
    totalItemCount(){
      let count = 0
      let todoList = this.dailyTodoList.todos
      for(let i=0;i<todoList.length;i++){
        if(todoList[i].status == 2 || todoList[i].status == 1){ //status == 1 indicate un-checked, 2 indicates checked
          count += 1
        }
      }
      return count
    },
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
      this.$refs.AddTodoForm.isAddingTodo = !this.$refs.AddTodoForm.isAddingTodo
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
    showAddTodoFailSnackbar(res){
      this.$emit('showSnackbar',res)
    },
    bulkMoveToToday(){
      this.$emit('bulkMoveToToday')
    }
  },
  updated:function(){
    this.countRenderedTodoItem()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
.bottomHint{
  background: #ECEFF1;
  position: absolute;
  bottom:0;
  right:0;
  width:100%;
  text-align: right;
  padding-right:12px;
  height:1.8rem;
  line-height: 1.6rem;
  .progressHint{
    color:#1B5E20;
    font-size: 0.8rem;
  }
  .progressHintIcon{
    transform:translateY(-1px);
  }
  .moveToTodayButton{
    font-size: 0.8rem;
    text-decoration: none;
    color:inherit;
  }
}

</style>
