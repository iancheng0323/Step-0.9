<template>
    <v-form action="" @submit.prevent="addTodo()" lazy-validation>
        <v-container v-if="isAddingTodo">
            <v-layout row wrap>
                <v-flex md12>
                    <v-text-field
                        name="name"
                        label=" "
                        id="todoInput"
                        ref="todoInput"
                        v-model="inputMessage"
                        autofocus
                        clearable
                        placeholder="Write Your Todo"
                        autocomplete="off"
                        @blur="isAddingTodo = false"
                        @click:clear="isAddingTodo = false"    
                        @keydown.esc="isAddingTodo = false"
                        hint="Press Enter To Add Todo"
                    ></v-text-field>
                </v-flex>
            </v-layout>
        </v-container>
        <div v-if="!isAddingTodo" @click="isAddingTodo = true" class="pointer mt-8">
            <v-icon>add_box</v-icon> click here to add new todo
        </div>
    </v-form>
</template>
<script>
export default {
    name: 'AddTodoForm',
    props:[
    ],
    data:function(){
        return{
            inputMessage: '',
            isAddingTodo:false
        }
    },
    computed:{
    },
    methods:{
        addTodo: function(){
            if(this.inputMessage.trim().length>0){
                this.$emit('addTodo',this.inputMessage)
                this.inputMessage = ''
            }else{
                this.$emit('addTodoFail',[2,'Invalid Input'])
            }
        },
        toggleAddTodo: function(){
            this.isAddingTodo = !this.isAddingTodo
        },
    },
    mounted: function(){
        document.body.addEventListener('focus',function(){
            console.log('wow focus')
        })
    },
    watch:{
    }
}
</script>
<style>

</style>
