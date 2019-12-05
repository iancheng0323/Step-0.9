import { vuexfireMutations, firestoreAction } from 'vuexfire'
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
            todos:[]
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
        },
        addBacklogItem(state,payload){
            state.backlog.todos.push(payload.todoItem)
        },
        ...vuexfireMutations,
    },
    actions:{ //methods
        getBacklogFromFirebase: firestoreAction(({ state,bindFirestoreRef }) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('backlog', db.collection(`Main`).doc(`${state.uid}`).collection('todoItem').doc('backlog'))
        }),
        updateBacklogToFirebase ({commit,state},payload){
            let backlogDbRef = db.collection(`Main`).doc(`${state.uid}`).collection('todoItem').doc('backlog')
            backlogDbRef.set(
                {todos: state.backlog.todos}
            ).then(payload.callbackFunc)
            console.log('updateBacklogToFirebase')
        },
        addBacklogItem({commit,state},payload){
            console.log('addBacklogItem')
            let newTodoItem = {
                title: payload.title,
                descriptopn:'',
                status: payload.status,
                creationTimeStamp: Date.now(),
                creationTime: '',
                dueTime:'',
                color: '',
                src: payload.src
            }
            commit('addBacklogItem',{todoItem:newTodoItem})
        },
        editBacklogItem({commit,state},payload){
            // let todoID = res[0]
            // let editedTitle = res[1]
            // edit local backlog todo
            // this.backlog.todos[todoID].title = editedTitle
            // update changes to firebase
            // this.updateBacklogTodoList()
            console.log('editBacklogItem')

        },
        deleteBacklogItem({commit,state},payload){
            // let todoID = res[0]
            // delete local backlog object
            // this.backlog.todos.splice(todoID,1)
            // update changes to firebase
            // this.updateBacklogTodoList()
            console.log('deleteBacklogItem')

        },
        moveBacklogItemToToday({commit,state},payload){
            // let todoID = res[0]
            // let title = res[1]
            // set current local backlog item status to 1, due date to today
            // this.backlog.todos[todoID].status = 1
            // this.backlog.todos[todoID].dueDate = this.parsedDisplayDateInHyphen
            // copy the todo item in local daily todo
            // this.dailyTodoList.todos.push(this.backlog.todos[todoID])
            // delete current local backlog item 
            // this.backlog.todos.splice(todoID,1)
            // update changes to firebase
            // this.updateBacklogTodoList()
            // this.updateMainTodoList()
            console.log('moveBacklogItemToToday')

        },
    },
    getters:{ // computed

    },
})