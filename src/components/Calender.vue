<template>
    <v-card outlined tile class="pb-0">
        <v-card-title class="caption text-uppercase">
            Calendar
        </v-card-title>
        <v-card-text class="px-0 pb-0">
            <v-calendar
            show-month-on-first
            color="teal lighten-4"
            :now="parsedDisplayDateInHyphen"
            v-model="pickedDate"
            @click:date="changeDate"
        ></v-calendar>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
    props:[
    ],
    data(){
        return{
            pickedDate:'',
            beforeValue:'',
            afterValue:'',
        }
    },
    computed:{
        ...mapState([
            'parsedDisplayDateInHyphen',
            'parsedCurrentDateInHyphen',
        ]),
        ...mapGetters([
        ]),
    },
    methods:{
        changeDate(){
            let startDate = Date.parse(this.beforeValue)
            let endDate = Date.parse(this.pickedDate)
            const aDay = 86400000
            let diff = Math.floor((endDate - startDate)/aDay)
            this.beforeValue = this.pickedDate
            this.$store.commit('setDisplayDate',{val : diff})
            this.$store.commit('setParsedDisplayDateInHyphen',{date : this.pickedDate})
            this.$emit('changeDate') //Trigger coresponding necessary method at mother component
        },
        resetDate(){
            this.pickedDate = this.parsedDisplayDateInHyphen
            this.beforeValue = this.parsedDisplayDateInHyphen
        },
        prevDay(){
            console.log('s')
            // this.$store.commit('setDisplayDate',{val : -1})
            // this.$emit('changeDate')
        },
        nextDay(){
            console.log('s')
            // this.$store.commit('setDisplayDate',{val : 1})
            // this.$emit('changeDate') //Trigger coresponding necessary method at mother component
        },
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