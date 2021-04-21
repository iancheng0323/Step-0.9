<template>
    <v-container class="pa-0">
            <Calender
                :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                @changeDate="changeDate"
            ></Calender>
            <NoDates
                :activeElement="activeElement"
                :uid="uid"
                :noDatesList="noDatesList"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
            ></NoDates>
    </v-container>
</template>
<script>
// import Backlog from './Backlog.vue'
import Calender from './Calender.vue'
import NoDates from './NoDates.vue'

export default {
    props:[
        'uid',
        'parsedCurrentDateInHyphen',
        'parsedDisplayDateInHyphen',
        'activeElement',
        'noDatesList'
    ],    
    components: {
        Calender,
        NoDates
    },
    methods:{
        changeDate(res){
            this.$emit('changeDate',res)
        },
    }
}
</script>
<style scope>

</style>
