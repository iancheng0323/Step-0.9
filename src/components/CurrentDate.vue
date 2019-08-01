<template>
    <h1>{{displayDate}}</h1>
</template>
<script>
export default {
    name:'CurrentDate',
    data:function(){
        return{
            yyyy: 'YYYY',
            mm: 'MM',
            dd: 'DD',
            day: 0,
        }
    },
    computed: {
        displayDate: function() {
            return `${this.yyyy}/${this.mm}/${this.dd}, ${this.computedDate}`
        },
        computedDate: function(){
            switch(this.day){
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
    beforeMount: function(){
        this.date = '2019/01/01 Monday'
        let today = new Date();
        this.dd = String(today.getDate()).padStart(2, '0');
        this.mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        this.yyyy = today.getFullYear();
        this.day = today.getDay();
    }
}
</script>
<style scoped>

</style>
