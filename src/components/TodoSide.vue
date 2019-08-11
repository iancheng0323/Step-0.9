<template>
    <v-card height="500" elevation="4">
        <Calender></Calender>
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
}
</script>
<style scope>

</style>
