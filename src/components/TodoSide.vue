<template>
    <v-card min-height="500">
        <Calender
        :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
        :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
        @changeDate="changeDate"
        ></Calender>
        <Backlog
        :uid="uid"
        :parsedCurrentDateInHyphen="parsedCurrentDateInHyphen"
        :parsedDisplayDateInHyphen="parsedDisplayDateInHyphen"
        :activeElement="activeElement"
        @editBacklogItem="editBacklogItem"
        @deleteBacklogItem="deleteBacklogItem"
        @moveBacklogItemToToday="moveBacklogItemToToday">
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
        'activeElement',
        
    ],    
    components: {
        Backlog,
        Calender
    },
    methods:{
        changeDate(res){
            this.$emit('changeDate',res)
        },
        editBacklogItem(res){
            this.$emit('editBacklogItem',res)
        },
        deleteBacklogItem: function(res){
            this.$emit('deleteBacklogItem',res)
        },
        moveBacklogItemToToday: function(res){
            this.$emit('moveBacklogItemToToday',res)
        }
    }
}
</script>
<style scope>

</style>
