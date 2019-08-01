<template>
    <li><input type="checkbox" v-bind:checked="checked()">{{msg}}</li>
</template>

<script>
export default {
    name:'TodoItem',
    props:[
        'msg',
        'status'
    ],
    computed:{
        checked: function(){
            if( this.status == 1 ){
                return true
            }else{
                return false
            }
        }
    }
}
</script>

<style scoped>

</style>
