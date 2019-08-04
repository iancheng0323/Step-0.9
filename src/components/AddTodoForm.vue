<template>
    <v-form action="" @submit.prevent="addTodo()" lazy-validation>
        <v-container>
            <v-layout row wrap>
                <v-flex md8>
                    <v-text-field
                        name="name"
                        label=" "
                        id="id"
                        v-model="inputMessage"
                        ref="todoInput"
                        autofocus
                        clearable
                        placeholder="Write Your Todo"
                        autocomplete="off"
                    ></v-text-field>
                </v-flex>
                <v-flex md4>
                    <v-btn color="success" type="submit">Add Todo</v-btn>                    
                </v-flex>
            </v-layout>
        </v-container>
    </v-form>
</template>
<script>
export default {
    name: 'AddTodoForm',
    data:function(){
        return{
            inputMessage: '',
        }
    },
    methods:{
        addTodo: function(){
            if(this.inputMessage.length>0){
                this.$emit('addTodo',this.inputMessage)
                this.inputMessage = ''
            }else{
                this.$emit('addTodoFail','Empty Input')
            }
        }
    },
    mounted: function(){
    }
}
</script>
<style>

</style>
