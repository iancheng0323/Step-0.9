<template>
  <v-card min-height="640" class="pb-12 pt-0" outlined tile>
    <v-container class="px-0 pt-0">
      <v-row class="px-4 py-1">
        <v-btn color="#757575" x-small text left rounded light @click="dateOption = !dateOption">
          ☀️ Today ({{this.parsedDisplayDateInSlash}})
        </v-btn>
        <DateOption
        class="absolute"
        v-show="dateOption"
        @setDateOption="setDateOption">
        </DateOption>
        <v-spacer></v-spacer>
        <v-btn @click="actionMenu = !actionMenu" color="#757575" x-small tile icon class="mr-1">
          <v-icon>
            more_horiz
          </v-icon>
        </v-btn>
      </v-row>
      <TodoMainActionMenu
          class="absolute"
          v-show="actionMenu"
          :hideDone="hideDone"
          @addRoutine="addRoutine()"
          @addDivider="addDivider()"
          @toggleHideDone="toggleHideDone()"
      ></TodoMainActionMenu>
      <v-divider color="#EEEEEE"></v-divider>
      <ul v-show="mainTodoListRecieved" class="mt-0" ref="mainTodoUl">
        <draggable 
        :list='dailyTodoList' 
        handle=".dragIndicator"
        ghost-class="ghost"
        drag-class="sortable-drag"
        chosen-Class = "sortable-chosen"
        @end="dragTodo"
        >
          <li is="TodoItem" 
              v-for="(todo,index) in dailyTodoList"
              :hideDone="hideDone"
              :todo="todo"
              :key="index"
              :todoID="index"
              :activeElement="activeElement"
              :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
              :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
              @changeStatus="changeStatus"
              @editTodo="editTodo"
              @deleteTodo="deleteTodo"
              @moveToBacklog="moveToBacklog"
              @moveToDate="moveToDate"
              @paintColor="paintColor"
              @moveToToday="moveToToday"
              @addComment="addComment"
              ></li>
        </draggable>
      </ul>
      <p v-if="totalItemCount == 0 && mainTodoListRecieved" class="mt-4 ml-4 grey--text" @click="$refs.AddTodoForm.isAddingTodo = true">
        💆‍♂️There's nothing todo, yet.
      </p>
      <v-progress-linear indeterminate color="#59C9A5" v-show="!mainTodoListRecieved"></v-progress-linear>
    </v-container>
    <v-container>
      <AddTodoForm 
        @addTodo="addTodo"
        @addTodoFail="showAddTodoFailSnackbar"
        ref="AddTodoForm"
        v-if="mainTodoListRecieved"
        v-shortkey="['shift', 'n']" 
        @shortkey.native="addTodoShortKey()"
      ></AddTodoForm>
    </v-container>
    <div class="bottomHint">
      <span class="progressHint" v-if="doneItemCount == totalItemCount && totalItemCount != 0">
        <!-- <v-icon size="12" color="#4CAF50" class="progressHintIcon">favorite</v-icon>  -->
        🎉 Congratulations! You've finished your todos for today.
      </span>
      <span class="progressHint" v-else>
        💪{{doneItemCount}}/{{totalItemCount}} Done 
        <span v-if="totalItemCount != 0">({{Math.floor((doneItemCount/totalItemCount) * 100)}}%)</span>
        <span v-if="doneItemCount<totalItemCount && parsedCurrentDateInHyphen !=parsedDisplayDateInHyphen"> | </span>
        <a 
        class="moveToTodayButton"
        href="javascript:void(0)"
        @click="bulkMoveToToday"
        v-if="doneItemCount<totalItemCount && parsedCurrentDateInHyphen !=parsedDisplayDateInHyphen">
          📤 Move undones to today(in dev)</a>
      </span>
      </div>
  </v-card>
</template>

<script>
import TodoItem from './TodoItem.vue'
import AddTodoForm from './AddTodoForm'
import draggable from 'vuedraggable'
import TodoMainActionMenu from './TodoMainActionMenu.vue'
import DateOption from './DateOption.vue'

export default {
  name: 'TodoMain',
  props:[
    'parsedCurrentDateInHyphen',
    'parsedDisplayDateInHyphen',
    'activeElement',
    'dailyTodoList',
    'mainTodoListRecieved',
    'displayDate',
    'addedRoutine',
  ],
  components:{
    TodoItem,
    AddTodoForm,
    draggable,
    TodoMainActionMenu,
    DateOption
  },
  data(){
    return{
      inputMsg:'',
      rederedTodoItemCount: 0,
      actionMenu: false,
      computedPropertyForceUpdateHelper:0,
      hideDone: false,
      dateOption: false
    }
  },
  watch:{
    activeElement(newVal){
        if(this.actionMenu && newVal == 'BODY'){
            this.actionMenu = false
        }
    },
    displayDate(){
      this.$forceUpdate()
    }
  },
  computed:{
    doneItemCount(){
      let count = 0
      let todoList = this.dailyTodoList
      for(let i=0;i<todoList.length;i++){
        if(todoList[i].status == 2){ //status == 2 indicate checked
          count += 1
        }
      }
      return count
    },
    totalItemCount(){
      let count = 0
      let todoList = this.dailyTodoList
      for(let i=0;i<todoList.length;i++){
        if(todoList[i].status == 2 || todoList[i].status == 1){ //status == 1 indicate un-checked, 2 indicates checked
          count += 1
        }
      }
      return count
    },
    parsedDisplayDateInSlash(){
      return(this.parseDateInSlash(this.displayDate))
    }
  },
  created(){
  },
  methods:{
    addTodo(val){
      this.$refs.AddTodoForm.isAddingTodo = false
      this.$emit('addTodo',val)
    },
    editTodo(res){
      this.$emit('editTodo',res)
    },
    changeStatus(res){
      this.$emit('changeStatus',res)
    },
    deleteTodo(res){
      this.$emit('deleteTodo',res)
    },
    moveToBacklog(res){
      this.$emit('moveToBacklog',res)
    },
    toggleAddTodo(){
      this.$refs.AddTodoForm.isAddingTodo = !this.$refs.AddTodoForm.isAddingTodo
    },
    countRenderedTodoItem(){
      this.rederedTodoItemCount = this.$refs.mainTodoUl.childElementCount
    },
    moveToDate(res){
      this.$emit('moveToDate',res)
    },
    paintColor(res){
      this.$emit('paintColor',res)
    },
    moveToToday(res){
      this.$emit('moveToToday',res)
    },
    dragTodo(){
      this.$emit('dragTodo')
    },
    showAddTodoFailSnackbar(res){
      this.$emit('showSnackbar',res)
    },
    bulkMoveToToday(){
      this.$emit('bulkMoveToToday')
    },
    addTodoShortKey(){
      if(this.$refs.AddTodoForm.isAddingTodo === false){
        this.$refs.AddTodoForm.isAddingTodo = true
      }else{
        console.log('s')
      }
    },
    addRoutine(){
      if(this.addedRoutine){ // if routine added 
            this.$emit('showAddRoutinePop')
        }else{
            this.$emit('addRoutineItemToTodoList')
        }
      this.actionMenu = false
    },
    addDivider(){
      console.log('divider')
      this.actionMenu = false
    },
    parseDateInSlash(date){
        // eslint-disable-next-line
        let yyyy = date.getFullYear()
        let mm = String(date.getMonth() + 1) //January is 0!
        let dd = String(date.getDate())
        if(mm<10){
            mm = '0' + mm
        }
        if(dd<10){
            dd = '0' + dd
        }
        // return `${yyyy}/${mm}/${dd}, ${this.parseShortWeekDay(date)}` //return all
        return `${this.parseShortWeekDay(date)} ${mm}/${dd}` //return month, date, week day only
    },
    parseShortWeekDay(date){
        switch(date.getDay()){
            case 0:
                return 'Sunday'
            case 1:
                return 'Monday'
            case 2:
                return 'Tuesday'
            case 3:
                return 'Wednesday'
            case 4:
                return 'Thursday'
            case 5:
                return 'Friday'
            default:
                return 'Saturday'
      }
    },
    addComment(res){
      // Res Description
      // res:{
      //   id: id // Number
      //   comment: comment //String
      //   time: time // Number, unix time stamp
      // }
      this.$emit('addComment',res)
    },
    toggleHideDone(){
      this.hideDone = !this.hideDone
      this.actionMenu = false
    },
    setDateOption(option){
      console.log(option)
      this.dateOption = false
    }
  },
  updated(){
    this.countRenderedTodoItem()
  },
  mounted() {
    this.computedPropertyForceUpdateHelper ++
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.absolute{
  position: absolute;
}
ul{
  margin-left: 0!important;
  padding-left: 0!important;
}
.pointer {
  cursor: pointer;
}
.sortable-drag{
    opacity: 0;
}
.sortable-chosen{
    background: rgba(12,120,120,0.2);
}
.bottomHint{
  background: #ECEFF1;
  position: absolute;
  bottom:0;
  right:0;
  width:100%;
  text-align: right;
  padding-right:12px;
  height:1.8rem;
  line-height: 1.6rem;
  .progressHint{
    color:#1B5E20;
    font-size: 0.8rem;
  }
  .progressHintIcon{
    transform:translateY(-1px);
  }
  .moveToTodayButton{
    font-size: 0.8rem;
    text-decoration: none;
    color:inherit;
  }
}

</style>
