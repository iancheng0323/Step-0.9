<template>
    <li :class="todoStatus" v-if="status != 0 && status != 3">
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
            <v-btn 
            text
            x-small
            right
            tile
            absolute
            icon
            :ripple="false"
            class="moreIcon"
            @click="toggleActionMenu"
            :class="{opacity1: actionMenu}"
            >
                <v-icon>more_horiz</v-icon>
            </v-btn>
            <v-expand-transition>
            <v-card 
            class="actionMenu absolute" 
            v-if="actionMenu" 
            elevation="1"
            transition="scroll-y-transition">
                <v-list dense>
                    <v-list-item-group>
                        <v-list-item
                        @click="deletePop = true"
                        class="text-center text-uppercase" 
                        >
                            <v-list-item-content>
                                <v-list-item-title 
                                >
                                Delete
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                        @click="movetoBacklog"
                        class="text-center text-uppercase" 
                        >
                            <v-list-item-content>
                                <v-list-item-title 
                                >
                                Move To Backlog
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card>
            </v-expand-transition>
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
        'activeElement'
    ],
    computed:{
        todoStatus:function(){
            if( this.status == 1 ){
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
                toStatus = 2
            }else{
                toStatus = 1
            }
            this.$emit('changeStatus',[this.todoID,toStatus])
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
            this.$emit('deleteTodo',[this.todoID, this.title])
        },
        movetoBacklog: function(){
            this.$emit('moveToBacklog',[this.todoID, this.title])
        }
    },
    watch:{
        activeElement: function(newVal){
            if(this.actionMenu && newVal == 'BODY'){
                this.actionMenu = false
            }
        }
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
    border-bottom: 1px solid rgba(0,0,0,0);
    &:focus{
        outline: none;
        border-bottom: 1px solid rgba(0,0,0,0.2);
    }
}
.todo .todoTitle{
    color:inherit;
    transition: 0.1s;
}
.done .todoTitle{
    color:#c8c8c8;
    text-decoration: line-through;
    transition: 0.1s;
}
.done .todoTitle:focus{
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
    opacity: 0;
    transition:0.05s;
    top:0;
    // &:focus{
    //     opacity: 1;
    // }
}
.todoItem{
    &:hover{
        background-color: rgba(0,0,0,0.02);
        .moreIcon{
            opacity: 1;
        }
    }
}
.actionMenu{
    width:150px;
    right:15px;
    top:30px;
    z-index: 100;
}
.opacity1{
    opacity:1!important;
}
</style>
