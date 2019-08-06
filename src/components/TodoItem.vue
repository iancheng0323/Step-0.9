<template>
    <li :class="todoStatus" v-if="status != 2">
        <v-container class="relative py-1">
            <v-btn class="todoMarkBox"
            :height="checkboxSize" 
            :width="checkboxSize" 
            min:width="0" 
            tile x-small 
            depressed
            @click="changeStatus()"
            ref="todoMarkBox"
            ></v-btn>
            <input class="todoTitle" :value="title" @input="editTodo">
            <v-icon class="moreIcon" @click="toggleActionMenu">more_horiz</v-icon>
            <v-card class="actionMenu absolute" v-if="actionMenu">
                <v-list dense flat inactive>
                    <v-list-item-group>
                        <v-list-item ripple>
                            <v-list-item-content>
                                <v-list-item-title class="text-center text-uppercase" @click="deletePop = true">Delete</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </v-container>
        <v-dialog
            v-model="deletePop"
            max-width="290"
        >
        <v-card>
            <v-card-title class="headline">Delete "{{title}}" ?</v-card-title>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="grey darken-1"
                text
                @click="deletePop = actionMenu = false"
            >
                No
            </v-btn>

            <v-btn
                color="red darken-1"
                text
                @click="deleteTodo"
            >
                Delete
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
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
                return 'todo todoItem'
            }else{
                return 'done todoItem'
            }
        }
    },
    data: function(){
        return{
            checkboxSize: 18,
            editedValue: '',
            actionMenu: false,
            deletePop: false
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
            // this.$refs.todoMarkBox.blur()
        },
        editTodo: function(event){
            this.editedValue = event.target.value
            this.$emit('editTodo',[this.todoID,this.editedValue])
        },
        toggleActionMenu: function(){
            this.actionMenu = !this.actionMenu
        },
        deleteTodo: function(){
            this.deletePop = false;
            this.$emit('deleteTodo',[this.todoID])
        },
    }
}
</script>

<style scoped lang="scss">
.relative{
    position:relative
}
.absolute{
    position:absolute;
}
li{
    list-style: none;
    position: relative;
}
.todoMarkBox{
    min-width:0px!important;
    position:absolute;
    top:7px;
}
.todoTitle{
    width:100%;
    display:block;
    padding-left:26px;
}
.todoTitle:hover{
    background-color: rgba(0,0,0,0.02);
}
.todo .todoTitle{
    color:inherit;
    transition: 0.1s;
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
    transition: 0.1s;
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
.actionMenu{
    width:100px;
    right:0;
    top:20px;
    z-index: 100;
}
.todoItem:hover .moreIcon{
    opacity: 1;
    
}

.todoItem .moreIcon{
    opacity: 0;
    transition:0.05s
}
</style>
