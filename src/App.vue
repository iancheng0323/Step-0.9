<template>
  <v-app id="App">
    <v-content>
      <router-view 
      @signInWithGoogle="signInWithGoogle"
      @logout="logout"
      @showSnackbar="showSnackbar"
      :auth="auth"
      :userName="userName"
      :userEmail="userEmail"
      :uid="uid"
      >
      </router-view>
    </v-content>
    <v-navigation-drawer 
      permanent 
      app 
      :width="navWidth"
      v-if="auth"
      dark
      >
        <!-- <v-container> -->
          <v-list>
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
          <v-container>
                <v-btn text block class="myAccountButton" to="account">
                  <v-icon class="icon">account_circle</v-icon> My Account
                </v-btn>
                <!-- <v-btn text block class="myAccountButton" @click="toggleNav">
                  <v-icon class="icon">chevron_left</v-icon> Show Less
                </v-btn> -->
          </v-container>
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
let provider = new firebase.auth.GoogleAuthProvider();

export default {
  name: 'app',
  data: function(){
    return{
      minNav: false,
      listItem: [
        {
          title: 'Step',
          link: '/',
          iconText: 'fa-paw',
          fontSize: '24'
        },
        {
          title: 'Mountain',
          link: '/mountains',
          iconText: 'fa-mountain',
          fontSize: '20'
        },
        {
          title: 'number',
          link: '/numbers',
          iconText: 'fa-cube',
          fontSize: '24'
        },
        {
          title: 'routine',
          link: '/routines',
          iconText: 'fa-clock',
          fontSize: '24'
        },
      ],
      snackbarMessage: '',
      snackbarControl: false,
      snackbarColor: '',
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
    signInWithGoogle: function(){
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
    logout: function(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log('signed out')
      }).catch(function(error) {
        // An error happened.
        console.log(error)
      })
    },
    redirect: function(){
      if(this.auth == false){
        console.log('auth changed to false')
        this.$router.push({ path: '/login' })
      } else{
        console.log('auth changed to true')
        this.$router.push({ path: '/' })
      }
    },
    toggleNav:function(){
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
  created:function(){
    let v = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        v.$store.commit('setAuth',{auth:true})
        v.$store.commit('setUser',{
          user: user
        })
        console.log('Signed In')
        v.redirect()
      } else {
        v.$store.commit('setAuth',{auth:false})
        console.log('Enter page as non-user')
        v.redirect()
      }
      v.redirect()
    })
  },
  watch:{
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
    color:#009688!important;
    
  }
  .menuTitle{
    color: #009688;
  }
}
.myAccountButton{
  .icon{
    margin-right:12px;
  }
}
</style>