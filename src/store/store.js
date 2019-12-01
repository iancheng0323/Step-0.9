import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebaseConfig.js'

Vue.use(Vuex)


export const store = new Vuex.Store({
    state:{ //data
        currentDate: new Date(),
        currentWeekdayIndex: new Date().getDay(),
        auth: false,
        user: {},
        userName: '',
        userEmail: '',
        uid: '',
        token:'',
        backlog:{
            todo:[]
        }
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
        },
        setAuth(state,payload){
            state.auth = payload.auth
        },
        setToken(state,payload){
            state.token = payload.token
        }
    },
    actions:{ //methods
        getBacklogFromFirebase (){
            let v= this
            let backlogDbRef = db.collection(`Main`).doc(`${this.uid}`).collection('todoItem').doc('backlog')      
            backlogDbRef.get().then(function(doc){
                if(doc.exists && doc.data().todos){
                console.log('found backlog -- vuex')
                v.backlog = doc.data()
                } else{
                console.log('No backlog doc found.  -- vuex')
                }
            }).catch(function(err){
                console.log(err)
            })
            v.backlogRecieved = true
            this.commit('setBacklog',{
                backlog: {
                    todo:[1]
                }
            })
        }

    },
    getters:{ // computed

    },
})