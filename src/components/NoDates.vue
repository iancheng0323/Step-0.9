<template>
  <v-card class="mt-2" outlined tile>
        <v-container>
            <h1 class="my-2 title">No Dates</h1>
            <li is="BacklogItem"
            v-for="(todo,index) in noDatesList"
            :todo="todo"
            :key="index"
            :title="todo.title"
            :status="todo.status"
            :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
            >
            </li>
            <BacklogItem
            :title="'Test'"
            >
            </BacklogItem>
        </v-container>
    </v-card>
</template>

<script>
import BacklogItem from './BacklogItem.vue'
export default {
    name: 'NoDates',
    components:{
        BacklogItem
    },
    props:[
        'uid',
        'noDatesList',
        'parsedDisplayDateInHyphen'
        ],
    data(){
        return{
            
        }
    },
    methods:{
        
    },
    watch:{
        
    }

}
</script>

<style>

</style>