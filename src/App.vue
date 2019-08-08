<template>
  <v-app id="App">
    <v-content>
      <router-view 
      @signInWithGoogle="signInWithGoogle"
      @logout="logout"
      :auth="auth"
      :userName="userName"
      :userEmail="userEmail"
      >

      </router-view>
    </v-content>
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
      auth: false,
      user: Object,
      userName: String,
      userEmail: String,
      token: 0,
    }
  },
  methods: {
    signInWithGoogle: function(){
      let v = this
      firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          v.token = result.credential.accessToken
          // The signed-in user info.
          v.user = result.user
          v.userName = result.user.displayName
          v.userEmail = result.user.email
          console.log(v.userName, v.userEmail)
          // ...
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
      let v = this
      firebase.auth().signOut().then(function(){
        // console.log(res)
        v.auth = false
      })
    },
  },
  created:function(){
    let v = this
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        v.auth = true
      } else {
        console.log('NOT logged in')
      }
    });
  }
}
</script>

<style>
#App {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>