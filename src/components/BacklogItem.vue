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
            <v-card 
            class="actionMenu absolute" 
            v-if="actionMenu" 
            elevation="1">
                <v-list dense>
                    <v-list-item-group>
                        <v-list-item
                        @click="moveToToday()"
                        class="text-center text-uppercase" 
                        >
                            <v-list-item-content>
                                <v-list-item-title 
                                >
                                Move To Today
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
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
                Move To Today
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
    name: 'BacklogItem',
    props: [
        'title',
        'todoID',
        'activeElement'
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
.actionMenu{
    width:150px;
    right:0;
    top:20px;
    z-index: 100;
}
.opacity1{
    opacity:1!important;
}
</style>
