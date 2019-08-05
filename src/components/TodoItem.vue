<template>
    <li :class="todoStatus">
        <v-btn class="todoMarkBox"
        :height="checkboxSize" 
        :width="checkboxSize" 
        min:width="0" 
        tile x-small 
        depressed
        @click="changeStatus()"
        ></v-btn>
        <input class="todoTitle" :value="title" @input="editTodo">
    </li>
</template>

<script>
export default {
    name:'TodoItem',
    props:[
        'title',
        'status',
        'todoID',
    ],
    computed:{
        todoStatus:function(){
            if( this.status == 0 ){
                return 'todo'
            }else{
                return 'done'
            }
        }
    },
    data: function(){
        return{
            checkboxSize: 15,
            editedValue: ''
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
        },
        editTodo: function(event){
            this.editedValue = event.target.value
            this.$emit('editTodo',[this.todoID,this.editedValue])
        }
    }
}
</script>

<style scoped>
li{
    list-style: none;
}
.todoMarkBox{
    min-width:0px!important;
}
.todo .todoTitle{
    color:inherit;
    transition: 0.2s;
}

.done .todoTitle{
    color:#c8c8c8;
    text-decoration: line-through;
    transition: 0.2s;

}


.todo .todoMarkBox{
    background: #f8f8f8!important;
    outline: 1px solid rgba(0,0,0,0.1);
}
.done .todoMarkBox{
    background-color: #888!important;
    outline: 1px solid rgba(0,0,0,0.05);
    }
</style>
