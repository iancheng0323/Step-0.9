<template>
  <v-card max-width="350" min-height="480">
        <v-card-title class="white--text" :style="{background:titleBackground}">
          {{title}}
          <v-btn small text icon right absolute>
              <v-icon color="white">more_horiz</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-container>
            <!-- <h2 class="title">Header Title 1</h2> -->
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
                v-shortkey="['alt', 'n']"
                @shortkey="toggleAddTodo()"
                @addTodo="addTodo"
                @addTodoFail="showAddTodoFailSnackbar"
                @toggleAddTodo="toggleAddTodo"
                ref="AddTodoForm"
            ></AddTodoForm>
        </v-container>
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
            titleBackground: 'purple',
            title: 'Mountain Title',
            activeElement: '',
            mountainItemList:{
                todos:[
                    {
                        title: 'something',
                        status: 1,
                        color: ''
                    },
                    {
                        title: 'something else',
                        status: 2,
                        color: ''
                    },
                ],
                meta:{},
            },
            isAddingTodo: false,
        }
    },
    methods:{
        createNewTodoObject: function(title,status,todoSrc){
            let newTodoItem = {
                title: title,
                descriptopn:'',
                status: status,
                creationTimeStamp: Date.now(),
                creationTime: `${this.parsedCurrentDateInHyphen}`,
                dueTime:`${this.parsedDisplayDateInHyphen}`,
                color: '',
                src: todoSrc
            }
            return newTodoItem
        },
        addTodo(res){
            let v = this
            this.mountainItemList.todos.push(
               v.createNewTodoObject(
                   res, //title
                   1, //status
                   'mountain', //todoSrc
               ) 
            )
            this.$emit('addTodo',res)
        },
        changeStatus(res){
            let todoID = res[0]
            let toStatus = res[1]
            this.mountainItemList.todos[todoID].status = toStatus
        },
        editTodo(){
            console.log('editTodo')
        },
        deleteTodo(res){
            let todoID = res[0]
            // let title = res[1]
            this.mountainItemList.todos[todoID].status = 0
        },
        moveToDate(){
            console.log('moveToDate')
        },
        paintColor(res){
            let todoID = res[0]
            let color = res[1]
            this.mountainItemList.todos[todoID].color = color
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

<style lang="scss">


</style>