<template>
  <v-app id="App">
    <v-app-bar
    v-if="auth"
    color="#23395B"
    fixed
    dark
    short
    app
    clipped-left
    flat
    >
      <v-app-bar-nav-icon
      @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
    <v-toolbar-title>
      <v-icon small class="mr-2 mb-1" >
        fa-paw
      </v-icon>
      <span class="title">Steps</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div>
      <v-btn
      text
      @click="accountCard = !accountCard"
      >
        <v-icon left>fa-user-circle</v-icon>
        <span class="text-uppercase">{{userName}}</span>
      </v-btn>
      <AccountCard
      :userName="userName"
      v-show="accountCard"
      @logout="logout()"
      ></AccountCard>
    </div>
    </v-app-bar>
        <v-content>
          <v-container>
            <router-view 
            @signInWithGoogle="signInWithGoogle"
            @showSnackbar="showSnackbar"
            :auth="auth"
            :userName="userName"
            :userEmail="userEmail"
            :uid="uid"
            :activeElement="activeElement"
            >
            </router-view>
          </v-container>
        </v-content>
        <v-navigation-drawer
        v-if="auth"
        app
        :width="navWidth"
        light
        v-model="drawer"
        clipped
          >
          <v-list class="pt-0">
          <v-list-item-group>
            <v-list-item
            v-for="(item,index) in listItem"
            :key="index"
            link
            :to="item.link"
            active-class="activated"
            nav
            >
            <v-list-item-icon left>
                  <v-icon :size="item.fontSize" class="menuIcon">{{item.iconText}}</v-icon>
                </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize font-weight-medium menuTitle">
                  {{item.title}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <template v-slot:append>
          <v-divider></v-divider>
          <div class="py-4">
            <v-btn small block text :ripple="false" color="#BDBDBD" to="/about">About Steps</v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-snackbar v-model="snackbarControl" :timeout="2000" :color="snackbarColor" class="text-center">
        {{snackbarMessage}}
      </v-snackbar>
  </v-app>
</template>

<script>
//Firebase Login
import firebase from 'firebase'
import AccountCard from './components/AccountCard.vue'
let provider = new firebase.auth.GoogleAuthProvider();

export default {
  name: 'app',
  components:{
    AccountCard,
  },
  data(){
    return{
      minNav: false,
      drawer: true,
      activeElement: '',
      listItem: [
        {
          title: 'List',
          link: '/',
          iconText: 'fa-lightbulb',
          fontSize: '24'
        },
        {
          title: 'Number',
          link: '/numbers',
          iconText: 'fa-cube',
          fontSize: '24'
        },
        {
          title: 'Settings',
          link: '/settings',
          iconText: 'fa-sliders-h',
          fontSize: '24'
        },
      ],
      snackbarMessage: '',
      snackbarControl: false,
      snackbarColor: '',
      accountCard: false,
    }
  },
  computed:{
    navWidth: function(){
      if (this.minNav){
        return("80")
      }else{
        return("220")
      }
    },
    userName(){
      return this.$store.state.userName
    },
    userEmail(){
      return this.$store.state.userEmail
    },
    uid(){
      return this.$store.state.uid
    },
    auth(){
      return this.$store.state.auth
    }
  },
  methods: {
    signInWithGoogle(){
      let v = this
      firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          v.$store.commit('setToken',{token:result.credential.accessToken})
          // The signed-in user info.
          }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code
          var errorMessage = error.message
          // The email of the user's account used.
          var email = error.email
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential
          // ...
          console.log(errorMessage, errorCode, email, credential)
      })
    },
    logout(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log('signed out')
      }).catch(function(error) {
        // An error happened.
        console.log(error)
      })
    },
    redirect(){
      if(this.auth == false){
        console.log('auth changed to false')
        this.$router.push({ path: '/login' })
      } else{
        console.log('auth changed to true')
        this.$router.push({ path: '/' })
      }
    },
    toggleNav(){
      this.minNav = !this.minNav
      console.log('s')
    },
    showSnackbar(res){
      let snackbarType = res[0]
      let message = res[1]
      switch (snackbarType){
        case 0: //success
          this.snackbarColor = 'success'
          break
        case 1: //error
          this.snackbarColor = 'error'
          break
        default: //neutral
          this.snackbarColor = ''
      }
      this.snackbarMessage = message
      this.snackbarControl = true
    },
  },
  created(){
    let v = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        v.$store.commit('setAuth',{auth:true})
        v.$store.commit('setUser',{
          user: user
        })
        v.$store.dispatch('getBacklogFromFirebase')
        v.$store.dispatch('getOtherInfoFromFirebase')
        console.log('Signed In')
        v.redirect()
      } else {
        v.$store.commit('setAuth',{auth:false})
        console.log('Enter page as non-user')
        v.redirect()
      }
      v.redirect()
    })
    this.$store.commit('setCurrentDate', {currentDate: new Date()}) //Pointing the date to current date
    this.$store.commit('setDisplayDate',{displayDate: new Date()}) //Set the display date on current date
    document.body.addEventListener('mouseup',function(){
        v.activeElement = document.activeElement.tagName
    })
  },
  watch:{
    activeElement(newVal){
      if(this.accountCard && newVal == 'BODY'){
          this.accountCard = false
      }
    },
  }
}
</script>

<style lang="scss">
#App {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.rotate180{
  transform: rotateZ(180deg)
}
.activated{
  .menuIcon{
    color:#47A184!important;
    
  }
  .menuTitle{
    color: #47A184;
  }
}
.myAccountButton{
  .icon{
    margin-right:12px;
  }
}
</style>