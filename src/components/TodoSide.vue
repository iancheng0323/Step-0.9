<template>
    <v-card min-height="500" elevation="4">
        <Calender
        :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
        :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
        @changeDate="changeDate"
        ></Calender>
        <Backlog
        :uid="uid"
        :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
        :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
        :activeElement="activeElement">
        </Backlog>
    </v-card>
</template>
<script>
import Backlog from './Backlog.vue'
import Calender from './Calender.vue'

export default {
    props:[
        'uid',
        'parsedCurrentDateInHyphen',
        'parsedDisplayDateInHyphen',
        'activeElement'
    ],    
    components: {
        Backlog,
        Calender
    },
    methods:{
        changeDate:function(res){
            this.$emit('changeDate',res)
            // console.log(res)
        }
    }
}
</script>
<style scope>

</style>
