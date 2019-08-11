<template>
    <v-container>     
    <DisplayDate
        @changeDate="changeDate" 
        :key="displayDateKey"
        :parsedDisplayDateInSlash="parsedDisplayDateInSlash">
    </DisplayDate>
    <v-container grid-list-md>
        <v-layout>
            <v-flex md8>
                <TodoMain 
                :displayDate="displayDate" 
                :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                :uid="uid"
                :activeElement="activeElement"
                >
                </TodoMain>
            </v-flex>
            <v-flex md4>
                <TodoSide
                :uid="uid"
                :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                :activeElement="activeElement"
                >
                </TodoSide>
            </v-flex>
        </v-layout>
    </v-container>
    <v-btn @click="logout" text right top absolute>Logout</v-btn>
    </v-container>
</template>

<script>
import TodoMain from '../components/TodoMain.vue'
import DisplayDate from '../components/DisplayDate.vue'
import TodoSide from '../components/TodoSide.vue'


export default {
  name: 'Steps',
  props:[
    'userName',
    'userEmail',
    'uid',
    'auth',
  ],
  components:{
    TodoMain,
    DisplayDate,
    TodoSide,
  },
  data: function(){
    return{
      currentDate: 0,
      displayDate:0,
      displayDateKey: 0,
      parsedDisplayDateInSlash:0,
      parsedDisplayDateInHyphen:0,
      parsedCurrentDateInHyphen:0,
      activeElement: '',
    }
  },
  computed: {
  },
  created: function(){
    this.currentDate = new Date()
    this.displayDate = new Date()
    this.setDates()
    let v = this
    document.body.addEventListener('mouseup',function(){
        v.activeElement = document.activeElement.tagName
    })
  },
  methods:{
    changeDate:function(val){
      this.displayDate.setDate(this.displayDate.getDate() + val)
      this.displayDateKey += 1
      this.setDates()
    },
    setDates: function(){
      this.parsedCurrentDateInHyphen = this.parseDateInHyphen(this.currentDate)
      this.parsedDisplayDateInSlash =  this.parseDateInSlash(this.displayDate)
      this.parsedDisplayDateInHyphen = this.parseDateInHyphen(this.displayDate)
    },
    parseDateInHyphen: function(date){
      let yyyy = date.getFullYear()
      let mm = String(date.getMonth() + 1) //January is 0!
      let dd = String(date.getDate())
      return `${yyyy}-${mm}-${dd}`
    },
    parseDateInSlash: function(date){
      let yyyy = date.getFullYear()
      let mm = String(date.getMonth() + 1) //January is 0!
      let dd = String(date.getDate())
      return `${yyyy}/${mm}/${dd}, ${this.parseWeekDay(date)}`
    },
    parseWeekDay: function(date){
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
    logout:function(){
      this.$emit('logout')
    },
  },
  watch: {
  }
}
</script>

<style>

</style>
