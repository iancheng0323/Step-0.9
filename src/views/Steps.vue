<template>
    <v-container>     
    <DisplayDate
        @changeDate="changeDate" 
        :key="displayDateKey"
        :parsedDisplayDateInSlash="parsedDisplayDateInSlash">
    </DisplayDate>
    <TodoMain 
        :displayDate="displayDate" 
        :currentDate="currentDate"
        :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
        >
    </TodoMain>
    <v-btn to="/login">Test</v-btn>
    </v-container>
</template>

<script>
import TodoMain from '../components/TodoMain.vue'
import DisplayDate from '../components/DisplayDate.vue'

export default {
  name: 'app',
  components:{
    TodoMain,
    DisplayDate,
    // MdButton
  },
  data: function(){
    return{
      currentDate: 0,
      displayDate:0,
      displayDateKey: 0,
      parsedDisplayDateInSlash:0,
      parsedDisplayDateInHyphen:0,
    }
  },
  computed: {
    computedDate: function(){
        switch(this.displayDate.getDay()){
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
  },
  created: function(){
    this.currentDate = new Date()
    this.displayDate = new Date()
    this.parseDate()
  },
  methods:{
    changeDate:function(val){
      // console.log(this.currentDate)
      this.displayDate.setDate(this.displayDate.getDate() + val)
      this.displayDateKey += 1
      this.parseDate()
    },
    parseDate: function(){
      let yyyy = this.displayDate.getFullYear()
      let mm = String(this.displayDate.getMonth() + 1) //January is 0!
      let dd = String(this.displayDate.getDate())
      this.parsedDisplayDateInSlash = `${yyyy}/${mm}/${dd}, ${this.computedDate}`
      this.parsedDisplayDateInHyphen = `${yyyy}-${mm}-${dd}`
    }
  }
}
</script>

<style>

</style>
