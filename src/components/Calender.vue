<template>
<!-- <v-container fluid> -->
    <v-card height="300" flat tile>
        <v-calendar
          color="teal lighten-4"
          :now="parsedDisplayDateInHyphen"
          v-model="pickedDate"
          @click:date="changeDate"
    ></v-calendar>
    </v-card>
<!-- </v-container> -->
</template>
<script>
export default {
    props:[
        'parsedCurrentDateInHyphen',
        'parsedDisplayDateInHyphen'
    ],
    data(){
        return{
            pickedDate:'',
            beforeValue:'',
            afterValue:'',
        }
    },
    methods:{
        changeDate(){
            let startDate = Date.parse(this.beforeValue)
            let endDate = Date.parse(this.pickedDate)
            const aDay = 86400000
            let diff = Math.floor((endDate - startDate)/aDay)
            this.beforeValue = this.pickedDate
            this.$store.commit('setDisplayDate',{val : diff})
            this.$emit('changeDate') //Trigger coresponding necessary method at mother component
        },
        resetDate(){
            this.pickedDate = this.parsedDisplayDateInHyphen
            this.beforeValue = this.parsedDisplayDateInHyphen
        }
    },
    created(){
        this.resetDate()
    },
    watch:{
        parsedDisplayDateInHyphen(){
            this.resetDate()
        }
    },
}
</script>
<style>
</style>