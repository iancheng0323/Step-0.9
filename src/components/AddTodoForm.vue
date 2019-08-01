<template>
    <form action="" @submit.prevent="addTodo">
        <input v-model="inputMessage" type="text" placeholder="something">
        <input type="submit" value="Add Todo">
    </form>
</template>
<script>
export default {
    name: 'AddTodoForm',
    data:function(){
        return{
            inputMessage: ''
        }
    },
    methods:{
        addTodo: function(){
        // eslint-disable-next-line
        console.log(this.inputMessage)
        // $emit(this.inputMessage)
        this.inputMessage = ''
        }
    }
}
</script>
<style>

</style>
