<template>
<v-container>
    <h1 class="headline mt-2 myHeader mb-2">
        ☀️ {{this.parsedDisplayDateInSlash}}
        <!-- <span class="date grey--text"></span> -->
    </h1>
    <!-- <v-btn text @click="prevDay" class="grey--text text-capitalize" small>Previous Day</v-btn> -->
    <!-- <v-btn text @click="nextDay" class="grey--text text-capitalize" small>Next Day</v-btn> -->
    <!-- <v-btn text @click="addRoutineItemToTodoList" class="grey--text text-capitalize" small>Add Routine</v-btn> -->
    <!-- <v-divider class="mt-1"></v-divider> -->
</v-container>
</template>
<script>
export default {
    name:'StepHeader',
    props:[
        'displayDate',
        'addedRoutine'
    ],
    data(){
        return{
        }
    },
    methods:{
        prevDay(){
            this.$store.commit('setDisplayDate',{val : -1})
            this.$emit('changeDate')
        },
        nextDay(){
            this.$store.commit('setDisplayDate',{val : 1})
            this.$emit('changeDate') //Trigger coresponding necessary method at mother component
        },
        parseDateInSlash(date){
            // eslint-disable-next-line
            let yyyy = date.getFullYear()
            let mm = String(date.getMonth() + 1) //January is 0!
            let dd = String(date.getDate())
            if(mm<10){
                mm = '0' + mm
            }
            if(dd<10){
                dd = '0' + dd
            }
            // return `${yyyy}/${mm}/${dd}, ${this.parseShortWeekDay(date)}` //return all
            return `${this.parseShortWeekDay(date)} ${mm}/${dd}` //return month, date, week day only
        },
        parseShortWeekDay(date){
            switch(date.getDay()){
                case 0:
                    return 'Sunday'
                case 1:
                    return 'Monday'
                case 2:
                    return 'Tuesday'
                case 3:
                    return 'Wednesday'
                case 4:
                    return 'Thursday'
                case 5:
                    return 'Friday'
                default:
                    return 'Saturday'
            }
        },
        addRoutineItemToTodoList(){
            if(this.addedRoutine){ // if routine added 
                this.$emit('showAddRoutinePop')
            }else{
                this.$emit('addRoutineItemToTodoList')
            }
        }
    },
    computed:{
        parsedDisplayDateInSlash(){
            return(this.parseDateInSlash(this.displayDate))
        }
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
