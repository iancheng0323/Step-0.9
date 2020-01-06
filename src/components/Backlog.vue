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
import db from '../firebaseConfig.js'


export default {
    name: 'Backlog',
    props:[
        'uid',
        'parsedCurrentDateInHyphen',
        'parsedDisplayDateInHyphen',
        'activeElement',
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
    computed:{
        backlog(){
            return this.$store.state.backlog
        },
    },
    created: function(){
    },
    methods:{
        addBacklogItem(payload){
            let title = payload
            let newTodoItem = {
                title: title,
                descriptopn:'',
                status: 1, //
                creationTimeStamp: Date.now(),
                creationTime: '',
                dueTime:'',
                color: '',
                src: 'backlog'
            }
            let update = this.backlog
            update.todos.push(newTodoItem)
            console.log(update)
            // db.collection(`Main`).doc(`${state.uid}`).collection('todoItem').doc('backlog').set(
            //     {}
            // )
        },
        editBacklogItem: function(res){
            this.$emit('editBacklogItem',res)
        },
        deleteBacklogItem: function(res){
            this.$emit('deleteBacklogItem',res)
        },
        moveBacklogItemToToday: function(res){
            this.$emit('moveBacklogItemToToday',res)
        },
        updateBacklogToFirebase(callbackFunc){
            let backlogDbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('backlog')
            backlogDbRef.set(
                {}//updates
            ).then(callbackFunc)
            console.log('updateBacklogToFirebase')
        },
    },
}
</script>
<style scope>
ul{
    padding-left: 0!important;
}

</style>