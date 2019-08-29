<template>
    <li class="relative todoItem">
        <v-container class="relative py-1">
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
            <TodoItemActionMenu
                :status="status"
                @deletePop="deletePop = true"
                @moveToToday="moveToToday"
                @showDatePicker="showDatePicker"
                @paintColor="paintColor"
                v-show="actionMenu"
            ></TodoItemActionMenu>
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
                    No Thanks
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
import TodoItemActionMenu from './TodoItemActionMenu.vue'
export default {
    name: 'BacklogItem',
    components:{
        TodoItemActionMenu,
    },
    props: [
        'title',
        'todoID',
        'activeElement',
        'status'
    ],
    data: function(){
        return{
            editedValue: '',
            actionMenu: false,
            deletePop: false
        }
    },
    methods:{
        editTodo: function(event){
            this.editedValue = event.target.value
            this.$emit('editTodo',[this.todoID,this.editedValue])
        },
        toggleActionMenu: function(){
            this.actionMenu = !this.actionMenu
        },
        deleteTodo: function(){
            this.$emit('deleteTodo',[this.todoID, this.title])
            this.actionMenu = false
            this.deletePop = false
        },
        moveToToday: function(){
            this.$emit('moveToToday',[this.todoID,this.title])
        },
        showDatePicker(){
            console.log('DEV')
        },
        paintColor(){
            console.log('DEV')
        },

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
.absolute{
    position:absolute;
}
.relative{
    position:relative;
}
li{
    list-style: none;
}
.todoTitle{
    width:100%;
    // display:block;
    border-bottom: 1px solid rgba(0,0,0,0);
    &:focus{
        outline: none;
        border-bottom: 1px solid rgba(0,0,0,0.2);
    }
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
.opacity1{
    opacity:1!important;
}
</style>
