<template>
  <v-container>
      <h1 class="title">Calendar</h1>
      <v-card height="600" width="100%" flat class="mt-6">
          <v-calendar
        show-month-on-first
        color="teal lighten-4"
        :now="parsedDisplayDateInHyphen"
        v-model="pickedDate"
        @click:date="changeDate"
        interval-height="128"
        :events="events"
        class="pa-0 ma-0"
    ></v-calendar>

      </v-card>
      
  </v-container>
</template>

<script>
export default {
    data(){
        return{
            events:[
                {
                    name: 'event1',
                    start: '2020-05-31',
                    end: '2020-06-02',
                    color: 'red'
                },
                {
                    name: 'event2',
                    start: '2020-05-30',
                    end: '2020-06-01',
                    color: 'teal'
                },
                {
                    name: 'event3',
                    start: '2020-05-14',
                    end: '2020-05-17',
                    color: 'teal'
                }

            ],
        }
    }

}
</script>

<style>

</style>