<template>
<v-container fluid>
    <h1 class="my-2 display-1" >Calender</h1>
    <v-calendar
          color="teal lighten-4"
          :now="parsedDisplayDateInHyphen"
          @click:date="changeDateTo()"
          v-model="pickedDate"
        ></v-calendar>
</v-container>
</template>
<script>
export default {
    props:[
        'parsedCurrentDateInHyphen',
        'parsedDisplayDateInHyphen'
    ],
    data: function(){
        return{
            pickedDate:''
        }
    },
    methods:{
        changeDateTo:function(){
            // this.$emit('changeDateTo',[this.pickedDate])
            // console.log([this.pickedDate])
        }
    },
    created: function(){
        this.pickedDate = this.parsedDisplayDateInHyphen
    },
    watch:{
        pickedDate:function(next, prev){
            if(prev != ''){
            // console.log(prev, '->', next)
            let startDate = Date.parse(prev)
            let endDate = Date.parse(next)
            const aDay = 86400000
            let diff = Math.floor((endDate - startDate)/aDay)
            this.$emit('changeDate',diff)
            }
        },
        parsedDisplayDateInHyphen:function(){
            // this.pickedDate = this.parsedDisplayDateInHyphen
        }
    }
}
</script>
<style>
</style>