import { vuexfireMutations, firestoreAction } from 'vuexfire'
import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebaseConfig.js'


Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{ //data
        currentDate: 0,
        currentWeekdayIndex: new Date().getDay(),
        auth: false,
        user: {},
        userName: '',
        userEmail: '',
        photoURL:'',
        uid: '',
        token:'',
        backlog:{
            todos:[]
        },
        displayDate: 0,
        routine:{
            list:[]
        },
        otherInfo:{},
    },
    mutations:{ // sets or updates the state
        setBacklog(state, payload){
            state.backlog = payload.backlog
        },
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
        addBacklogItem(state,payload){
            state.backlog.todos.push(payload.todoItem)
        },
        setDisplayDate(state,payload){
            if(payload.displayDate){
                state.displayDate = payload.displayDate
                // Vue.set(state, 'displayDate', payload.displayDate)
            }else{
                state.displayDate.setDate(state.displayDate.getDate() + payload.val)
                // Vue.set(state, 'displayDate', state.displayDate.getDate() + payload.val)
            }
        },
        setCurrentDate(state,payload){
            state.currentDate = payload.currentDate
        },
        ...vuexfireMutations,
    },
    actions:{ //methods
        getBacklogFromFirebase: firestoreAction(({ state,bindFirestoreRef }) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('backlog', db.collection(`Main`).doc(`${state.uid}`).collection('todoItem').doc('backlog'))
        }),
        getOtherInfoFromFirebase: firestoreAction(({ state,bindFirestoreRef }) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('otherInfo', db.collection(`Main`).doc(`${state.uid}`))
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
    },
})