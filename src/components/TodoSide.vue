<template>
    <v-container class="pa-0">
            <Calender
                @changeDate="changeDate"
            ></Calender>
            <OverDue
                :uid="uid"
                :activeElement='activeElement'
                @showSnackbar="showSnackbar"
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
        showSnackbar(res){
            this.$emit('showSnackbar',res)
        },
    },
}
</script>
<style scope>

</style>
