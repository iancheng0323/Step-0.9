<template>
    <v-container fluid>
        <h1 class="my-2 display-1">
            Backlog
        </h1>
        <ul>
            <li is="BacklogItem" 
              v-for="(todo,index) in rawBacklogList" 
              :title="todo.title"
              :key="index" 
              :status="todo.status"
              :todoID="todo.id"
              :activeElement="activeElement"
              @editTodo="editTodo"
              @deleteTodo="deleteTodo"
              @moveToToday="moveToToday"
              ></li>
      </ul>
      <AddTodoForm
        @addTodo="addTodo"
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
        'activeElement'
    ],
    components:{
        BacklogItem,
        AddTodoForm,
    },
    data:function(){
        return{
            rawBacklogList: {},
            isAddingTodo: false,
            showSnackbar: false,
            snackbarMessage: ''
        }
    },
    created: function(){
        this.bindToFirebase()
    },
    methods:{
        addTodo: function(val){
        let v = this
        db.collection(`todoItem`).doc(`${this.uid}`).collection('all').add(
            v.createNewTodoObject(val)
            ).then(function(){
            console.log('backlog added')
        })
        this.$refs.AddTodoForm.isAddingTodo = false
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
            v.snackbarMessage = `"${title}" Deleted.`
            v.showSnackbar = true
        })
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
        bindToFirebase: function(){
        this.$bind(
        'rawBacklogList',
        db
        .collection('todoItem')
        .doc(`${this.uid}`)
        .collection('all')
        .where('status','==', 3)
        ).then(function(){
            console.log('Backlog data received'
        )})},
        moveToToday: function(res){
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
        }
    },
    watch:{
        uid: function(){
            this.bindToFirebase()
        }
    }
}
</script>
<style scope>
ul{
    padding-left: 0!important;
}

</style>