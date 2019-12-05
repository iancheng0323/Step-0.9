<template>
    <v-container fluid>
        <h1 class="my-2 headline">
            Backlog
        </h1>
        <ul>
            <li is="BacklogItem" 
              v-for="(todo,index) in backlog.todos" 
              :title="todo.title"
              :key="index" 
              :status="todo.status"
              :todoID="index"
              :activeElement="activeElement"
              @editTodo="editBacklogItem"
              @deleteTodo="deleteBacklogItem"
              @moveToToday="moveBacklogItemToToday"
              ></li>
      </ul>
      <AddTodoForm
        @addTodo="addBacklogItem"
        ref="AddTodoForm"
      ></AddTodoForm>
      <v-snackbar v-model="showSnackbar" :timeout="2000">
        {{snackbarMessage}}
      </v-snackbar>
    </v-container>
</template>

<script>
import BacklogItem from './BacklogItem.vue'
import AddTodoForm from './AddTodoForm'

export default {
    name: 'Backlog',
    props:[
        'uid',
        'parsedCurrentDateInHyphen',
        'parsedDisplayDateInHyphen',
        'activeElement',
        'backlog'
    ],
    components:{
        BacklogItem,
        AddTodoForm,
    },
    data:function(){
        return{
            isAddingTodo: false,
            showSnackbar: false,
            snackbarMessage: ''
        }
    },
    created: function(){
    },
    methods:{
        addBacklogItem(title){
            this.$store.dispatch('addBacklogItem',
                {
                    title: title,
                    status: 1, //status 1 indicate not-done
                    src: 2
                }
            )
        },
        editBacklogItem: function(res){
            this.$emit('editBacklogItem',res)
        },
        deleteBacklogItem: function(res){
            this.$emit('deleteBacklogItem',res)
        },
        moveBacklogItemToToday: function(res){
            this.$emit('moveBacklogItemToToday',res)
        }
    },
}
</script>
<style scope>
ul{
    padding-left: 0!important;
}

</style>