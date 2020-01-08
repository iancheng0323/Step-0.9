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
        'parsedCurrentDateInHyphen',
        'parsedDisplayDateInHyphen',
        'activeElement',
    ],
    components:{
        BacklogItem,
        AddTodoForm,
    },
    data(){
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
        uid(){
            return this.$store.state.uid
        },
    },
    created(){
    },
    methods:{
        updateBacklog(payload,callbackFunc){
            db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('backlog').set(
                {todos: payload}
            ).then(callbackFunc)
        },
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
            let update = this.backlog.todos
            update.push(newTodoItem)
            this.updateBacklog(update)
        },
        editBacklogItem(res){
            //res is an array with todoID at 0 and edited content(title) at 1
            let todoID = res[0]
            let title = res[1]
            let update = this.backlog.todos
            update[todoID].title = title
            this.updateBacklog(update)
        },
        deleteBacklogItem(res){
            //res is an array with todoID at 0 and todoTitle at 1
            let todoID = res[0]
            // let title = res[1]
            let update = this.backlog.todos
            update[todoID].status = 0
            this.updateBacklog(update)
        },
        moveBacklogItemToToday(res){
            this.$emit('moveBacklogItemToToday',res)
        },
    },
}
</script>
<style scope>
ul{
    padding-left: 0!important;
}
</style>