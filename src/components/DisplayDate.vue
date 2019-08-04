<template>
    <h1 class="display-2 my-2"><v-icon large @click="prevDay">chevron_left</v-icon>{{parsedDate}}<v-icon large @click="nextDay">chevron_right</v-icon></h1>
</template>
<script>
export default {
    name:'DisplayDate',
    props:[
        'displayDate'
    ],
    data:function(){
        return{
        }
    },
    computed: {
        parsedDate: function() {
            let yyyy = this.displayDate.getFullYear()
            let mm = String(this.displayDate.getMonth() + 1).padStart(2, '0') //January is 0!
            let dd = String(this.displayDate.getDate()).padStart(2, '0')
            return `${yyyy}/${mm}/${dd}, ${this.computedDate}`
        },
        computedDate: function(){
            switch(this.displayDate.getDay()){
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
