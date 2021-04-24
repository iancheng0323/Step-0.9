import { vuexfireMutations, firestoreAction } from 'vuexfire'
import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebaseConfig.js'


Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{ //globle data
        currentDate: 0,
        displayDate: 0,
        auth: false,
        user: {},
        userName: '',
        userEmail: '',
        photoURL:'',
        uid: '',
        token:'',
        routine:{
            list:[]
        },
        otherInfo:{},
        userInfo:{},
    },
    mutations:{ // sets or updates the state
        setUser(state, payload){
            state.user = payload.user
            state.uid = state.user.uid
            state.userName = state.user.displayName
            state.userEmail = state.user.email
            state.photoURL = state.user.photoURL
        },
        setAuth(state,payload){
            state.auth = payload.auth
        },
        setToken(state,payload){
            state.token = payload.token
        },
        setDisplayDate(state,payload){
            if(payload.displayDate){
                state.displayDate = payload.displayDate
                // Vue.set(state, 'displayDate', payload.displayDate)
            }else{
                state.displayDate.setDate(state.displayDate.getDate() + payload.val) // Here might be the ause of getter not responding
                // Vue.set(state, 'displayDate', state.displayDate.getDate() + payload.val)
            }
        },
        setCurrentDate(state,payload){
            state.currentDate = payload.currentDate
        },
        ...vuexfireMutations,
    },
    actions:{ //methods
        getUserInfo: firestoreAction(({ state,bindFirestoreRef }) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('userInfo', db.accounts.doc(`${state.uid}`))
        }),
        getOtherInfoFromFirebase: firestoreAction(({ state,bindFirestoreRef }) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('otherInfo', db.root.collection(`Main`).doc(`${state.uid}`))
        }),
    },
    getters:{ // computed
        parsedCurrentDateInHyphen: state => {
            let yyyy = state.currentDate.getFullYear()
            let mm = String(state.currentDate.getMonth() + 1) //January is 0!
            let dd = String(state.currentDate.getDate())
            if(mm<10){
                mm = '0' + mm
            }
            if(dd<10){
                dd = '0' + dd
            }
            return `${yyyy}-${mm}-${dd}`
        },
        parsedDisplayDateInHyphen: state => {
            let yyyy = state.displayDate.getFullYear()
            let mm = String(state.displayDate.getMonth() + 1) //January is 0!
            let dd = String(state.displayDate.getDate())
            if(mm<10){
                mm = '0' + mm
            }
            if(dd<10){
                dd = '0' + dd
            }
            return `${yyyy}-${mm}-${dd}`
        },
        parsedDisplayDateWeekday: state => {
            let weekday = state.displayDate.getDay()
            return weekday
        },
        parsedDisplayDateWeekdayEng: state => {
            let weekday = state.displayDate.getDay()
            let dayName
            switch(weekday){
                case 0:
                    dayName = 'Sunday'
                    break
                case 1:
                    dayName = 'Monday'
                    break
                case 2:
                    dayName = 'Tuesday'
                    break
                case 3:
                    dayName = 'Wednesday'
                    break
                case 4:
                    dayName = 'Thursday'
                    break
                case 5:
                    dayName = 'Friday'
                    break
                default:
                    dayName = 'Saturday'
            }
            return dayName
        },
    },
})