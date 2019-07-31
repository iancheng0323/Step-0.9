<template>
  <div class="todo-main">
    <h1>Todos</h1>
    <ul>
      <li>foo</li>
      <li>bar</li>
      <li>pho</li>
      <li>now</li>

    </ul>
    <h1>Completed</h1>
  </div>
</template>

<script>
export default {
  name: 'TodoMain',
  data: function(){
    return{

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-main{
  background:white;
  box-shadow: 0 3px 3px rgba(0,0,0,0.2);
  border-radius: 10px;
}
</style>
