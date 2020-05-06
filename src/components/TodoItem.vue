<template>
    <li :class="todoStatus" v-if="status != 0 && status != 3">
        <v-container class="relative pt-2 pb-1">
            <v-row>
                <v-col cols="12" class="pa-0 d-flex align-content-center">
                    <v-icon
                    class="dragIndicator ml-n1"
                    size="20"
                    >drag_indicator</v-icon>
                    <v-btn 
                    class="todoMarkBox ma-2 ml-0"
                    :height="checkboxSize" 
                    :width="checkboxSize" 
                    min:width="0" 
                    tile x-small 
                    depressed
                    @click="changeStatus()"
                    ref="todoMarkBox"
                    :ripple="{ 'center' :true}"
                    icon
                    >
                        <v-icon size="22" :color="todoColor" class="colorLabel" v-show="status == 1">brightness_1</v-icon>
                        <v-icon size="22" color="grey" class="uncheckedCheckbox" v-show="status == 1">check_circle_outline</v-icon>
                        <v-icon size="22" color="#81C784" class="checkedCheckbox" v-if="status == 2">check</v-icon>
                    </v-btn>
                    <input 
                    class="todoTitle flex-grow-1"
                    :value="title" 
                    @input="editTodo"
                    @focus="isEditing = true"
                    @blur="isEditing = false"
                    ref="todoTitleInput"
                    @keydown.esc="blurInput"
                    @keydown.enter="blurInput">
                    <!-- <v-btn
                    x-small
                    right
                    icon
                    tile
                    :ripple="false"
                    class="actionIcons mr-2 mt-2"
                    @click="editLabelPanel = true"
                    :class="{opacity1: actionMenu}"
                    >
                        <v-icon>label</v-icon>
                    </v-btn> -->
                    <v-tooltip bottom transition="fade">
                        <template v-slot:activator="{ on }">
                            <v-btn
                            x-small
                            right
                            icon
                            tile
                            :ripple="false"
                            class="actionIcons mr-2 mt-2"
                            @click="editPriorityPanel = !editPriorityPanel"
                            :class="{opacity1: actionMenu}"
                            v-on="on"
                            >
                                <v-icon>flag</v-icon>
                            </v-btn>
                        </template>
                        <span class="caption pa-0">Add Priority</span>
                    </v-tooltip>
                    <EditPriorityPanel
                        v-if="editPriorityPanel"
                        @editPriority="editPriority"
                    ></EditPriorityPanel>
                    <EditLabelPanel
                        v-if="editLabelPanel"
                        @save="editLabelPanel = false"
                    ></EditLabelPanel>
                    <v-tooltip bottom transition="fade">
                        <template v-slot:activator="{ on }">
                            <v-btn
                            x-small
                            right
                            icon
                            tile
                            :ripple="false"
                            class="actionIcons mr-2 mt-2"
                            @click="addCommentPop = true"
                            :class="{opacity1: actionMenu}"
                            v-on="on"
                            >
                                <v-icon>add_comment</v-icon>
                            </v-btn>
                        </template>
                        <span class="caption pa-0">Add Comment</span>
                    </v-tooltip>
                    
                    <v-btn
                    x-small
                    right
                    icon
                    tile
                    :ripple="false"
                    class="actionIcons mr-4 mt-2"
                    @click="toggleActionMenu"
                    :class="{opacity1: actionMenu}"
                    >
                        <v-icon>more_horiz</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="mt-n1" v-if="label">
                <v-col col="12" class="pa-0 ml-4">
                    <span class="caption label">#{{label}}</span>
                </v-col>
            </v-row>
            <TodoItemActionMenu
                v-show="actionMenu"
                :status="status"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                @moveToToday="moveToToday"
                @showDatePicker="showDatePicker = true"
                @moveToBacklog="moveToBacklog"
                @paintColor="paintColor"
                @deletePop="deletePop = true"
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
                    No
                </v-btn>
                <v-btn
                    color="red darken-1"
                    text
                    @click="deleteTodo"
                    ref="deleteButton"
                >
                    Delete
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog :value="showDatePicker" @click:outside="showDatePicker=false" width="300">
            <v-date-picker v-model="datePickerValue">
                <v-btn block @click="moveToDate">Move</v-btn>
            </v-date-picker>
        </v-dialog>
        <v-dialog v-model="addCommentPop" width="600">
            <v-card min-height="300">
                <v-card-title>{{title}}</v-card-title>
                <v-card-subtitle>Drop comments here</v-card-subtitle>
                <v-divider></v-divider>
                <v-list-item v-for="(comment,index) in todo.comments" :key="index" ripple two-line>
                    <v-list-item-content>
                        <v-list-item-title>{{comment.comment}}</v-list-item-title>
                        <v-list-item-subtitle>added on {{parseTimestamp(comment.time)}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-card-text class="py-0">
                        <v-form>
                            <v-textarea
                            auto-grow
                            validate-on-blur
                            :rules="[commentTextareaRules]"
                            ref="commentTextarea"
                            placeholder="Write some comment about this todo item"
                            v-model="commentPopInput"
                            ></v-textarea>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="pa-6">
                        <v-spacer></v-spacer>
                        <v-btn @click="addCommentPop = false" text class="addRoutineFormButton">Cancel</v-btn>
                        <v-btn @click="addComment" class="addRoutineFormButton">Add</v-btn>
                    </v-card-actions>
            </v-card>
        </v-dialog>
        <v-divider color="#BDBDBD"></v-divider>
    </li>
</template>
<script>

import TodoItemActionMenu from './TodoItemActionMenu.vue'
import EditLabelPanel from './EditLabelPanel.vue'
import EditPriorityPanel from './EditPriorityPanel.vue'


export default {
    name:'TodoItem',
    components:{
        TodoItemActionMenu,
        EditLabelPanel,
        EditPriorityPanel,
    },
    props:[
        'todo',
        'todoID',
        'label',
        'activeElement',
        'parsedDisplayDateInHyphen',
        'parsedCurrentDateInHyphen',
    ],
    computed:{
        title(){
            return this.todo.title
        },
        status(){
            return this.todo.status
        },
        color(){
            return this.todo.color
        },
        todoStatus(){
            let r = ''
            if(this.isEditing){
                r = 'editing'
            }
            if( this.status == 1 ){
                r += ' todo todoItem'
            }else{
                r += ' done todoItem'
            }
            return r
        },
        todoColor(){
            let r
            if(this.color){
                r = this.color
            }else{
                r = '#BDBDBD'
            }
            return r
        },
    },
    data(){
        return{
            checkboxSize: 18,
            editedValue: '',
            actionMenu: false,
            deletePop: false,
            showDatePicker: false,
            datePickerValue: '',
            onHov:false,
            addCommentPop: false,
            editLabelPanel: false,
            isEditing: false,
            commentPopInput: '',
            addColorPanel: false,
            editPriorityPanel: false,
        }
    },
    created(){
        this.datePickerValue = this.parsedDisplayDateInHyphen
    },
    methods:{
        changeStatus(){
            let toStatus
            if(this.status == 1){
                toStatus = 2
            }else{
                toStatus = 1
            }
            this.$refs.todoMarkBox.$el.blur()
            this.$emit('changeStatus',[this.todoID,toStatus])
        },
        editTodo(event){
            this.editedValue = event.target.value
            this.$emit('editTodo',[this.todoID,this.editedValue])
        },
        toggleActionMenu(){
            this.actionMenu = !this.actionMenu
        },
        deleteTodo(){
            this.deletePop = false;
            this.$emit('deleteTodo',[this.todoID, this.title])
        },
        moveToBacklog(){
            this.$emit('moveToBacklog',[this.todoID, this.title])
        },
        moveToDate(){
            this.showDatePicker= false
            this.actionMenu = false
            this.$emit('moveToDate',[this.todoID,this.title,this.datePickerValue])
        },
        paintColor(res){
            let color = res[0]
            this.actionMenu = false
            this.$emit('paintColor',[this.todoID,color])
        },
        moveToToday(){
            this.actionMenu = false
            this.$emit('moveToToday',[this.todoID,this.title])
        },
        blurInput(){
            this.$refs.todoTitleInput.blur()
        },
        addComment(){
            if(this.commentPopInput === ''){
                return false
            }else{
                let res = {
                    id: this.todoID,
                    comment: this.commentPopInput,
                    time: Date.now()
                }
                this.$emit('addComment',res)
                this.commentPopInput = '' //Clear input area
            }
            // this.addCommentPop = false //Close Popup
        },
        commentTextareaRules(input){
            if(input === '' ){
                return 'Empty input'
            }else{
                return true
            }
        },
        parseTimestamp(timestamp){
            let dateObj = new Date(timestamp);
            let month = dateObj.getMonth() +1
            let date = dateObj.getDate()
            // Hours part from the timestamp
            let hours = dateObj.getHours()
            // Minutes part from the timestamp
            let minutes = "0" + dateObj.getMinutes()
            // Seconds part from the timestamp
            // let seconds = "0" + dateObj.getSeconds()
            let formattedTime = `${month}/${date} ${hours}:${minutes.substr(-2)} `
            return formattedTime
        },
        editPriority(res){
            let color = res[0].color
            // let value = res[0].value
            this.editPriorityPanel = false
            this.$emit('paintColor',[this.todoID,color])
        }
    },
    watch:{
        activeElement(newVal){
            if(this.actionMenu && newVal == 'BODY'){
                this.actionMenu = false
            }
            if(this.editPriorityPanel && newVal == 'BODY'){
                this.editPriorityPanel = false
            }
        },
        deletePop(){
            this.$nextTick(() => this.$refs.deleteButton.$el.focus())
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
    // min-width:0px!important;
    // position:absolute;
    // top:7px;
    outline-color: transparent;
    transition:0.01s
}
.todoTitle{
    // width:100%;
    display:block;
    // padding-left:26px;
    border-bottom: 2px solid rgba(255,255,255,0);
    font-size: 18px;
    &:focus{
        outline: none;
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
.done .todoMarkBox{
    outline-color: transparent!important;
}
.actionIcons{
    opacity: 0;
    transition:0.05s;
    // top:3px;
    // &:focus{
    //     opacity: 1;
    // }
}
.todoItem{
    // padding-top:6x;
    // padding-bottom:1px;
    // border-radius: 6px;
    // border-bottom:solid 1px rgba(0,0,0,0.02);
    &:hover{
        background-color: rgba(0,0,0,0.02);
        .actionIcons{
            opacity: 1;
        }
        .colorLabel{
            display: none;
        }
        .uncheckedCheckbox{
            display: inline-flex;
        }
        .dragIndicator{
            opacity: 0.2;
        }
    };
    // &:focus-within{
    //     background-color: rgba(89,201,165,0.08);
    // }
}
.editing{
    background-color: rgba(89,201,165,0.08)!important;
}
.opacity1{
    opacity:1!important;
}
.colorLabel{
    opacity: 1;
    transition:0.1s;
}
.uncheckedCheckbox{
    display: none;
}
.dragIndicator{
    cursor: grab;
    left:-2px;
    top:6px;
    opacity:0;
    transition:0.1s;
    &:active{
        cursor:grabbing;
    }
}
.label{
    color: #757575;
}
</style>
