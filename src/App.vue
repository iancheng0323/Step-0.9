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
      >
        <v-container>
          <v-list>
          <v-list-item-group>
            <v-list-item
            v-for="(item,index) in listItem"
            :key="index"
            link
            :to="item.link"
            active-class="activated"
            >
            <v-list-item-icon left>
                  <v-icon :size="item.fontSize" class="menuIcon">{{item.iconText}}</v-icon>
                </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase font-weight-medium menuTitle">
                  {{item.title}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-btn text icon absolute bottom class="mb-10 toggleNav" @click="toggleNav"><v-icon :class="{rotate180:minNav}">chevron_left</v-icon></v-btn>
        </v-container>
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
      auth: false,
      user: Object,
      userName: String,
      userEmail: String,
      uid: 0,
      token: 0,
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
    }
  },
  methods: {
    signInWithGoogle: function(){
      let v = this
      firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          v.token = result.credential.accessToken
          // The signed-in user info.
          v.setUserDetail(result.user)
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
      // let v = this
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log('signed out')
      }).catch(function(error) {
        // An error happened.
        console.log(error)
      })
    },
    setUserDetail: function(user){
          // The signed-in user info.
          this.user = user
          this.userName = user.displayName
          this.userEmail = user.email
          this.uid = user.uid
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
        v.auth = true
        v.setUserDetail(user)
        console.log('Signed In')
        v.redirect()
      } else {
        v.auth = false
        console.log('Enter page as non-user')
        v.redirect()
      }
      v.redirect()
    })
  },
  watch:{
    // auth: function(){
    //   this.redirect()
    // }
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
    color:#EC407A!important;
    
  }
  .menuTitle{
    color: #EC407A;
  }
}
</style>