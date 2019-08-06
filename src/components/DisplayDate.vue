<template>
    <h1 class="display-2 my-2"><v-icon large @click="prevDay">chevron_left</v-icon>{{this.parsedDisplayDateInSlash}}<v-icon large @click="nextDay">chevron_right</v-icon></h1>
</template>
<script>
export default {
    name:'DisplayDate',
    props:[
        'parsedDisplayDateInSlash'
    ],
    data:function(){
        return{
        }
    },
    methods:{
        prevDay:function(){
            this.$emit('changeDate',-1)
        },
        nextDay:function(){
            this.$emit('changeDate',1)

        },

    },
    watch: {
    }
}
</script>
<style scoped>

</style>
