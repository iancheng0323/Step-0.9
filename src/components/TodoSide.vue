<template>
    <v-container class="pa-0">
            <Calender
                :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                @changeDate="changeDate"
            ></Calender>
            <OverDue
                :uid="uid"
                :activeElement='activeElement'
                :parsedDisplayDateInHyphen='parsedDisplayDateInHyphen'
            >
            </OverDue>
            <NoDates
                :activeElement="activeElement"
                :uid="uid"
                :noDatesList="noDatesList"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
            ></NoDates>
    </v-container>
</template>
<script>
import OverDue from './OverDue.vue'
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
        NoDates,
        OverDue
    },
    methods:{
        changeDate(){
            this.$emit('changeDate')
        },
    },
}
</script>
<style scope>

</style>
