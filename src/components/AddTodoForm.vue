<template>
    <v-form 
    action="" 
    @submit.prevent="addTodo()" 
    lazy-validation
    >
        <v-container v-if="isAddingTodo" class="pt-0 mt-0">
            <v-layout row wrap>
                <v-flex md12>
                    <v-text-field
                        color="#59C9A5"
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
        <div v-if="!isAddingTodo" @click="isAddingTodo = true" class="pointer mt-4">
            <v-icon>add_box</v-icon> Click or press shift + n to add new todo
        </div>
    </v-form>
</template>
<script>
export default {
    name: 'AddTodoForm',
    props:[
    ],
    data(){
        return{
            inputMessage: '',
            isAddingTodo:false
        }
    },
    computed:{
    },
    methods:{
        addTodo(){
            if(this.inputMessage.trim().length>0){
                this.$emit('addTodo',this.inputMessage)
                this.inputMessage = ''
            }else{
                this.$emit('addTodoFail',[2,'Invalid Input'])
            }
        },
        toggleAddTodo(){
            this.isAddingTodo = !this.isAddingTodo
        },
        tester(){
            console.log('wow')
        },
    },
    mounted(){
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
