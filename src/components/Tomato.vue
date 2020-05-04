<template>
    <v-card class="mt-2" outlined tile>
        <v-container>
            <h1 class="my-2 title">Pomodoro Time</h1>
            
            <v-row>
                <v-col col="8">
                    <h2 class="overline">{{status}}</h2>
                    <h3 class="title">{{displayMin}}:{{displaySec}}</h3>
                </v-col>
                <v-col col="4">
                    <v-btn
                        class="float-right"
                        v-if="!counting"
                        @click="startCounting"
                        icon
                        ><v-icon>mdi-play</v-icon></v-btn>
                        <v-btn
                        class="float-right"
                        v-if="counting"
                        @click="pauseCounting"
                        icon
                        >
                        <v-icon>mdi-pause</v-icon></v-btn>
                        <v-btn
                        class="float-right"
                        v-if="middle || counting"
                        @click="newTomato"
                        icon
                        >
                        <v-icon>mdi-replay</v-icon></v-btn>
                        <v-btn
                        class="float-right"
                        v-if="middle || counting"
                        @click="stop"
                        icon
                        >
                        <v-icon>mdi-stop</v-icon></v-btn>
                </v-col>
            </v-row>
            <p>Finished Pomodoro: {{finishedTomatoCount}}</p>
        </v-container>
    </v-card>
</template>

<script>
// import db from '../firebaseConfig.js'

export default {
    name: 'Tomato',
    props:['uid'],
    data(){
        return{
            secondsLeft:1500,
            counting: false,
            timer: null,
            finishedTomatoCount: 0,
            onTomato: true,
            tomatoDefaultSecond: 1500,
            restDefaultSecond: 300,
        }
    },
    methods:{
        startCounting(){
            let v = this
            this.timer = setInterval(
                function(){
                     v.secondsLeft -= 1
                     }, 
                1000)
            this.counting = true
        },
        newTomato(){
            this.pauseCounting()
            this.secondsLeft = this.tomatoDefaultSecond
            this.onTomato = true
        },
        newRest(){
            this.pauseCounting()
            this.secondsLeft = this.restDefaultSecond
            this.onTomato = false
        },
        pauseCounting(){
            clearInterval(this.timer)
            this.counting = false
        },
        notify(title, body){
            //title === String
            //body === String
            // https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification#Parameters
            this.$notification.show(title, {
                body: body
            }, {})
        },
        updateTomatoCountToFirebase(callbackFunc){
            // db.collection(`Main`).doc(`${this.uid}`).update(
            // {
            //     :
            // }
            // ).then(callbackFunc)
            //TBD
            console.log(this.uid,callbackFunc)

        },
        stop(){
            console.log('s')
            if(this.onTomato){
                this.newRest()
            }else{
                this.newTomato()
            }
        }
    },
    computed: {
        displayMin(){
            return Math.floor(this.secondsLeft/60)
        },
        displaySec(){
            let r
            if(this.secondsLeft%60 < 10 ){
                r = '0' + this.secondsLeft%60
            }else{
                r = this.secondsLeft%60
            }
            return r
        },
        status(){
            if(this.onTomato){
                return 'Work'
            }else{
                return 'Rest'
            }
        },
        middle(){
            if(this.onTomato){
                if(this.secondsLeft !== this.tomatoDefaultSecond){
                    return true
                }else{
                    return false
                }
            }else{
                if(this.secondsLeft !== this.restDefaultSecond){
                    return true
                }else{
                    return false
                }
            }
        }
    },
    watch:{
        secondsLeft(){
            if(this.secondsLeft < 0){ // when time is up
                if(this.onTomato){ // when tomato is done
                    this.finishedTomatoCount += 1
                    this.newRest()
                    this.notify('🍅Tomato done', 'Time to take a break!')
                    this.updateTomatoCountToFirebase()
                }else{ // when rest is done
                    this.newTomato()
                    this.notify('🕑Rest done', 'Time to work!')
                }
            }
        }
    }
}
</script>

<style>

</style>