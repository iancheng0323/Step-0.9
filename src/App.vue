<template>
  <div id="Home">
    <CurrentDate></CurrentDate>
    <TodoMain></TodoMain>
  </div>
</template>

<script>
import TodoMain from './components/TodoMain.vue'
import CurrentDate from './components/CurrentDate.vue'

export default {
  name: 'app',
  components:{
    TodoMain,
    CurrentDate,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
