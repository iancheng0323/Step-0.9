<template>
<v-container fluid>
    <h1 class="my-2 display-1" >Calender</h1>
    <v-card height="300" outlined>
        <v-calendar
          color="teal lighten-4"
          :now="parsedDisplayDateInHyphen"
          v-model="pickedDate"
          @click:date="changeDate"
    ></v-calendar>
    </v-card>
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
            pickedDate:'',
            beforeValue:'',
            afterValue:'',
        }
    },
    methods:{
        changeDate: function(){
            let startDate = Date.parse(this.beforeValue)
            let endDate = Date.parse(this.pickedDate)
            const aDay = 86400000
            let diff = Math.floor((endDate - startDate)/aDay)
            console.log(this.beforeValue,this.pickedDate,diff)
            this.beforeValue = this.pickedDate
            this.$emit('changeDate',diff)
        },
        resetDate:function(){
            this.pickedDate = this.parsedDisplayDateInHyphen
            this.beforeValue = this.parsedDisplayDateInHyphen
        }
    },
    created: function(){
        this.resetDate()
    },
    watch:{
        parsedDisplayDateInHyphen:function(){
            this.resetDate()
        }
    },
}
</script>
<style>
</style>