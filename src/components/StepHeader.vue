<template>
<v-container>
    <h1 class="display-1 mt-2 font-weight-medium myHeader mb-2">
        ☀️ Steps for today
        <span class="date grey--text">{{this.parsedDisplayDateInSlash}}</span>
    </h1>
    <v-btn text @click="prevDay" class="grey--text text-capitalize" small>Previous Day</v-btn>
    <v-btn text @click="nextDay" class="grey--text text-capitalize" small>Next Day</v-btn>
    
    <v-divider class="mt-1"></v-divider>
</v-container>
</template>
<script>
export default {
    name:'StepHeader',
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
<style scoped lang="scss">
.relative{
    position:relative
}
.myHeader{
    .date{
        font-size: 18px;
        // color:grey;
    }
}
</style>
