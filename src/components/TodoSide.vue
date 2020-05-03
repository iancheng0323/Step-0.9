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
    </v-container>
</template>
<script>
// import Backlog from './Backlog.vue'
import Calender from './Calender.vue'
import Tomato from './Tomato.vue'

export default {
    props:[
        'uid',
        'parsedCurrentDateInHyphen',
        'parsedDisplayDateInHyphen',
        'activeElement',
    ],    
    components: {
        // Backlog,
        Calender,
        Tomato
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
