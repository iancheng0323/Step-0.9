<template>
  <div class="todo-main">
    <h1>Todos</h1>
    <ul>
      <li is="TodoItem" v-for="todo in sampleTodoList" :msg="todo.msg" :key="todo.key" :status="todo.status"></li>
    </ul>
    <input v-model="inputMsg" type="text" placeholder="something">
    <button @click="addTodo">Add Todo</button>
    <h1>Completed</h1>
    <ul>
      <li>foo</li>
      <li>bar</li>
      <li>pho</li>
      <li>now</li>
    </ul>
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue'

export default {
  name: 'TodoMain',
  components:{
    TodoItem
  },
  data: function(){
    return{
      sampleTodoList:[
        {
          msg: 'foo',
          status: 0,
          key:1
        },
        {
          msg: 'bar',
          status: 1,
          key:2
        },
        {
          msg: 'pho',
          status: 1,
          key:3
        }
      ],
      inputMsg:'',

    }
  },
  methods:{
    addTodo: function(){
      // eslint-disable-next-line
      console.log(this.inputMsg)
      this.sampleTodoList.push({
        msg: this.inputMsg,
        status: 0,
        key: this.sampleTodoList.length+1
      })
      this.inputMsg = ''
      
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
