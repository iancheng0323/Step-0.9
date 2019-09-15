<template>
  <v-card max-width="400">
        <v-card-title>
          {{title}}
        </v-card-title>
        <v-divider></v-divider>
        <ul ref="mountainUl">
        <draggable 
        :list='mountainItemList.todos' 
        handle=".dragIndicator"
        ghost-class="ghost"
        drag-class="sortable-drag"
        chosen-Class = "sortable-chosen"
        @end="dragTodo">
          <li is="TodoItem" 
              v-for="(todo,index) in mountainItemList.todos" 
              :title="todo.title"
              :key="index" 
              :status="todo.status"
              :todoID="index"
              :activeElement="activeElement"
              :color="todo.color"
              @changeStatus="changeStatus"
              @editTodo="editTodo"
              @deleteTodo="deleteTodo"
              @moveToDate="moveToDate"
              @paintColor="paintColor"
              @moveToToday="moveToToday"
              ></li>
        </draggable>
      </ul>
      <AddTodoForm 
        @addTodo="addTodo"
        @addTodoFail="showAddTodoFailSnackbar"
        @toggleAddTodo="toggleAddTodo"
        ref="AddTodoForm"
      ></AddTodoForm>
    </v-card>
</template>

<script>
import TodoItem from './TodoItem.vue'
import draggable from 'vuedraggable'
import AddTodoForm from './AddTodoForm'


export default {
    name: 'MountainCard',
    components:{
        TodoItem,
        draggable,
        AddTodoForm
    },
    data(){
        return{
            title: 'Mountain Title',
            activeElement: '',
            mountainItemList:{
                todos:[
                    {
                        title: 'something',
                        status: 1,
                        color: '#ffffff'
                    },
                    {
                        title: 'something else',
                        status: 2,
                        color: '#ffffff',
                    },
                ],
                meta:{},
            },
            isAddingTodo: false,
        }
    },
    methods:{
        addTodo(){
            console.log('Add Todo')
        },
        changeStatus(res){
            console.log(res)
        },
        editTodo(){
            console.log('editTodo')
        },
        deleteTodo(){
            console.log('deleteTodo')
        },
        moveToDate(){
            console.log('moveToDate')
        },
        paintColor(){
            console.log('paintColor')
        },
        moveToToday(){
            console.log('moveToToday')
        },
        dragTodo(){
            console.log('dragTodo')
        },
        showAddTodoFailSnackbar(){
            console.log('showAddTodoFailSnackbar')
        },
        toggleAddTodo(){
            this.isAddingTodo = !this.isAddingTodo
        },
    }
}
</script>

<style>

</style>