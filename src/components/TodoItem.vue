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
        <v-icon class="moreIcon">more_horiz</v-icon>
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
            checkboxSize: 18,
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

<style scoped lang="scss">
li{
    list-style: none;
    position: relative;
}
.todoMarkBox{
    min-width:0px!important;
    position:absolute;
    top:3px;
}
.todoTitle{
    width:100%;
    display:block;
    padding-left:26px;
}
.todo .todoTitle{
    color:inherit;
    transition: 0.2s;
    // border-bottom:2px solid rgba(12,34,46,0);
}
.todoTitle:focus{
    outline: none;
    // border-bottom:1px solid rgba(123,200,87,0.2);
    background: rgba(0,0,0,0.03);
}

.done .todoTitle{
    color:#c8c8c8;
    text-decoration: line-through;
    transition: 0.2s;
    // border-bottom:2px solid rgba(12,34,46,0);
}
.done .todoTitle:focus{
    // border-bottom:2px solid rgba(123,200,87,0.5);
    background: rgba(0,0,0,0.02);

}

.todo .todoMarkBox{
    background: #f8f8f8!important;
    outline: 1px solid rgba(0,0,0,0.1);
}
.done .todoMarkBox{
    background-color: #888!important;
    outline: 1px solid rgba(0,0,0,0.05);
}
.moreIcon{
    position: absolute;
    right:0;
    top:0;
    // float:right;
}
</style>
