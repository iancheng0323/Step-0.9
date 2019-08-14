<template>
    <h1 class="display-1 mt-2 font-weight-medium">
        <v-btn text icon @click="prevDay" class="prev">
            <v-icon large >chevron_left</v-icon>
        </v-btn>
        {{this.parsedDisplayDateInSlash}}
        <v-btn text icon @click="nextDay" class="next">
            <v-icon large @click="nextDay">chevron_right</v-icon>
        </v-btn>
    </h1>
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
.relative{
    position:relative
}
.next{}
</style>
