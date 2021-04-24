<template>
  <v-card class="mt-2" outlined tile>
        <v-container>
            <h1 class="my-2 title">Over Due</h1>
            <li is="TodoItem"
            v-for="(todo,index) in overdueList"
            :todo="todo"
            :key="index"
            :title="todo.title"
            :status="todo.status"
            :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
            :activeElement="activeElement"
            >
            </li>
        </v-container>
    </v-card>
</template>

<script>
import TodoItem from './TodoItem.vue'
import db from '../firebaseConfig.js'
import { mapGetters } from 'vuex'

export default {
    name: "OverDue",
    props:[
        'uid',
        'parsedDisplayDateInHyphen',
        'activeElement'
    ],
    components:{
        TodoItem
    },
    computed:{
        ...mapGetters([
            'parsedCurrentDateInHyphen',
        ])

    },
    data(){
        return{
            overdueList:[]
        }
    },
    methods:{
        getOverDueTodoListByDate(date){ //Refactored 20210403
            let v = this
            this.$bind(
                'overdueList',
                db.todoItems
                .where('uid', '==', v.uid)
                .where('dueTime', '<=', date)
                .where('deleted', '==', false)
                .where('status', '==', 1)
            )
        }
    },
    watch:{
        uid(){ // When user logs in, do the following
            this.getOverDueTodoListByDate(this.parsedCurrentDateInHyphen)
        },
    },
    created(){
        this.getOverDueTodoListByDate(this.parsedCurrentDateInHyphen)
    }
}
</script>

<style>

</style>