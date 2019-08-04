<template>
    <li>
        <v-btn class="checkbox px-0"
        :height="checkboxSize" 
        :width="checkboxSize" 
        min:width="0" 
        tile x-small 
        depressed
        @click="changeStatus()"
        :color="buttonColor"
        ></v-btn>
        {{title}}
    </li>
</template>

<script>
export default {
    name:'TodoItem',
    props:[
        'title',
        'status',
        'todoID'
    ],
    computed:{
        buttonColor: function(){
            if( this.status == 0 ){
                return '#123456'
            }else{
                return '#f2f2f2'
            }
        }
    },
    data: function(){
        return{
            checkboxSize: 15,

        }
    },
    methods:{
        changeStatus: function(){
            let toStatus
            if(this.status == 1){
                toStatus = 0
            }else{
                toStatus = 1
            }
            this.$emit('changeStatus',[this.todoID,toStatus])
        }
    }
}
</script>

<style scoped>
li{
    list-style: none;
}
.checkbox{
    min-width:0px!important;
}
</style>
