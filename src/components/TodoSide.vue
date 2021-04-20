<template>
    <v-container class="pa-0">
            <Calender
                :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
                @changeDate="changeDate"
            ></Calender>
            <!-- <Backlog
            :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
            :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
            :activeElement="activeElement">
            </Backlog> -->
            <Tomato
                :uid="uid"
            ></Tomato>
            <NoDates
                :uid="uid"
                :noDatesList="noDatesList"
                :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
            ></NoDates>
    </v-container>
</template>
<script>
// import Backlog from './Backlog.vue'
import Calender from './Calender.vue'
import Tomato from './Tomato.vue'
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
        // Backlog,
        Calender,
        Tomato,
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
