import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        currentDate: new Date(),
        currentWeekdayIndex: new Date().getDay(),
        auth: '',
        userName: '',
        userEmail: '',
        uid: '',
    },
    mutations:{

    },
    actions:{

    },
    getters:{

    }
})