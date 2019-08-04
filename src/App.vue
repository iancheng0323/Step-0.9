<template>
  <v-app id="Home">
    <v-content>
      <v-container>     
        <DisplayDate :displayDate="displayDate" v-on:changeDate="changeDate" :key="displayDateKey"></DisplayDate>
        <TodoMain :displayDate="displayDate" :currentDate="currentDate"></TodoMain>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import TodoMain from './components/TodoMain.vue'
import DisplayDate from './components/DisplayDate.vue'

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
    }
  },
  created: function(){
    this.currentDate = new Date()
    this.displayDate = new Date()
  },
  methods:{
    changeDate:function(val){
      // console.log(this.currentDate)
      this.displayDate.setDate(this.displayDate.getDate() + val)
      this.displayDateKey += 1
    }
  }
}
</script>

<style>
#Home {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
