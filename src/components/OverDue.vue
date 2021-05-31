<template>
  <v-card class="mt-2" outlined tile>
        <v-container>
            <h1 class="my-2 title">Over Due</h1>
            <li is="TodoItem"
                v-for="(todo,index) in overdueList"
                :todo="todo"
                :key="index"
                :inOverDue="true"
                :activeElement="activeElement"
                @showSnackbar="showSnackbar"
            >
            </li>
        </v-container>
    </v-card>
</template>

<script>
import TodoItem from './TodoItem.vue'
import db from '../firebaseConfig.js'
import { mapState,mapGetters } from 'vuex'

export default {
    name: "OverDue",
    props:[
        'uid',
        'activeElement'
    ],
    components:{
        TodoItem
    },
    computed:{
        ...mapState([
            'parsedCurrentDateInHyphen',
            'parsedDisplayDateInHyphen',
        ]),
        ...mapGetters([
        ])

    },
    data(){
        return{
            overdueList:[]
        }
    },
    methods:{
        getOverDueTodoListByDate(){
            let v = this
            this.$bind(
                'overdueList',
                db.todoItems
                .where('uid', '==', v.uid)
                .where('deleted', '==', false)
                .where('status', '==', 1)
                .where('dueTime', '<', v.parsedCurrentDateInHyphen)
            )
        },
        showSnackbar(res){
            this.$emit('showSnackbar',res)
        },
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