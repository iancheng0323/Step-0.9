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
              :todoID="todo.id"
              :activeElement="activeElement"
              @editTodo="editBacklogItem"
              @deleteTodo="deleteBacklogItem"
              @moveToToday="moveBacllogItemToToday"
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
        addBacklogItem: function(val){
            let v = this
            db.collection(`todoItem`).doc(`${this.uid}`).collection('all').add(
                v.createNewTodoObject(val)
                ).then(function(){
                console.log('backlog added')
            })
            this.$refs.AddTodoForm.isAddingTodo = false
            this.$emit('addBacklogItem',val)
        },
        editBacklogItem: function(res){
            let todoID = res[0]
            let eiditedTitle = res[1]
            db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
                {
                title: eiditedTitle
                }
            )
            this.$emit('editBacklogItem',res)
        },
        deleteBacklogItem: function(res){
            let todoID = res[0]
            let title = res[1]
            let v = this
            db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
                {
                status: 0
                }
            ).then(function(){
                v.snackbarMessage = `"${title}" Deleted.`
                v.showSnackbar = true
            })
            this.$emit('deleteBacklogItem',res)
        },
        createNewTodoObject: function(title){
        let newTodoItem = {
            title: title,
            descriptopn:'',
            status: 3,
            creationTimeStamp: Date.now(),
            creationTime: `${this.parsedCurrentDateInHyphen}`,
            dueTime: 'not set',
        }
        return newTodoItem
        },
        moveBacllogItemToToday: function(res){
            let todoID = res[0]
            let title = res[1]
            let v = this
            db.collection(`todoItem`).doc(`${this.uid}`).collection('all').doc(todoID).update(
            {
                status: 1,
                dueTime: this.parsedDisplayDateInHyphen
            }
            ).then(function(){
                v.snackbarMessage = `"${title}" added to ${v.parsedDisplayDateInHyphen}.`
                v.showSnackbar = true
            })
            this.$emit('moveBacllogItemToToday',res)
        }
    },
}
</script>
<style scope>
ul{
    padding-left: 0!important;
}

</style>