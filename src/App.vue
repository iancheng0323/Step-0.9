<template>
  <v-app id="App">
    <!-- <v-app-bar
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
      <div>
      <AccountCard
        :userName="userName"
        :userEmail="userEmail"
        v-show="accountCard"
        @logout="logout()"
      ></AccountCard>
    </div>
      <v-icon small class="mr-2 mb-1" >
        fa-paw
      </v-icon>
      <span class="title">Steps</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    </v-app-bar> -->
        <!-- Main Content  -->
        <v-content>
            <router-view
            v-if="userInfo"
            @signInWithGoogle="signInWithGoogle"
            @showSnackbar="showSnackbar"
            :auth="auth"
            :userName="userName"
            :userEmail="userEmail"
            :uid="uid"
            :activeElement="activeElement"
            >
            </router-view>
        </v-content>
        <!-- Nav  -->
        <v-navigation-drawer
          v-if="auth"
          app
          :width="navWidth"
          light
          permanent
            >
          <!-- <AccountCard
                  :userName="userName"
                  :userEmail="userEmail"
                  v-show="accountCard"
                  @logout="logout()"
          ></AccountCard> -->
          <v-list class="pt-0" flat>
            <v-list-item-group>
              <v-list-item two-line @click="accountCard = true">
                <v-list-item-avatar color="teal">
                    <img
                      :src="photoURL"
                      :alt="userName"
                    >
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span class="text-uppercase">{{userName}}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{userEmail}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
              </v-list-item>
            <v-list-item
            class="py-0"
            v-for="(item,index) in listItem"
            :key="index"
            link
            :to="item.link"
            active-class="activated"
            nav
            dense
            >
            <v-list-item-icon left class=" mr-1 ml-2">
                  <v-icon small class="menuIcon">{{item.iconText}}</v-icon>
                </v-list-item-icon>
              <v-list-item-content class="py-0">
                <v-list-item-title class="text-uppercase menuTitle py-0">
                  {{item.title}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <!-- <v-list-item dense @click="addProjectDialog = !addProjectDialog">
              <v-list-item-icon left class=" mr-1 ml-2">
                <v-icon dense>add</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="py-0">
                <v-list-item-title class="text-uppercase menuTitle py-0">
                  Add Project
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
            <!-- <v-list-item
            class="mt-2"
            link
            to="/"
            active-class="activated"
            nav
            >
              <v-list-item-content>
                <v-list-item-title class="text-capitalize font-weight-medium menuTitle">
                  list
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
          </v-list-item-group>
        </v-list>
        <template v-slot:append>
          <v-divider></v-divider>
          <div class="py-4">
            <v-btn small block text :ripple="false" color="#BDBDBD" to="/settings">Settings</v-btn>
            <v-btn small block text :ripple="false" color="#BDBDBD" to="/about">About Steps</v-btn>
          </div>
        </template>
      </v-navigation-drawer>
        <!-- Global Snackbars  -->
      <v-snackbar v-model="snackbarControl" :timeout="2000" :color="snackbarColor" class="text-center">
        {{snackbarMessage}}
      </v-snackbar>
      <!-- Global Popups  -->
      <v-dialog v-model="addProjectDialog" width="400">
        <v-card>
                <v-card-title style="word-break:normal;">Add Project</v-card-title>
                <v-card-text class="py-0">
                        <v-form>
                            <v-text-field placeholder="Enter Project Name"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="pa-2">
                        <v-spacer></v-spacer>
                        <v-btn @click="addProjectDialog = false" text>Cancel</v-btn>
                        <v-btn @click="addProject">Add</v-btn>
                    </v-card-actions>
            </v-card>
      </v-dialog>
  </v-app>
</template>

<script>
//Firebase Login
import firebase from 'firebase'
import db from './firebaseConfig.js'
import parseDate from './parseDate.js'
// import AccountCard from './components/AccountCard.vue'
let provider = new firebase.auth.GoogleAuthProvider();

export default {
  name: 'app',
  components:{
    // AccountCard,
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
      ],
      snackbarMessage: '',
      snackbarControl: false,
      snackbarColor: '',
      accountCard: false,
      addProjectDialog: false
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
    photoURL(){
      return this.$store.state.photoURL
    },
    uid(){
      return this.$store.state.uid
    },
    auth(){
      return this.$store.state.auth
    },
    userInfo(){
      return this.$store.state.userInfo
    },
  },
  methods: {
    signInWithGoogle(){
      let v = this
      firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          v.$store.commit('setToken',{token:result.credential.accessToken})

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
        console.log('User signed out')
      }).catch(function(error) {
        // An error happened.
        console.log(error)
      })
    },
    redirect(){
      if(this.auth == false){
        this.$router.push({ path: '/login' })
      }
    },
    toggleNav(){
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
    addProject(){
      console.log('add Project called')
    },
  },
  created(){
    let v = this
    firebase.auth().onAuthStateChanged( function(user) {
      if (user) {
        // Set user info & settings for application
        v.$store.commit('setAuth',{auth:true})
        v.$store.commit('setUser',{
          user: user
        })
        const userProfileRef = db.accounts.doc(`${user.uid}`)
        // Check if user already exist
        userProfileRef.get().then( function(doc){
          if(doc.exists){
            console.log('Existing user')
          } else{
            console.log('New user')
            userProfileRef.set(
              {
                opt:{
                  hideDone: false,
                },
              }).then( ()=> console.log('Initial user settings set'))
            }
        }) 
        v.$store.dispatch('getUserInfo')
        v.$store.dispatch('getOtherInfoFromFirebase')
        v.redirect()
      } else {
        v.$store.commit('setAuth',{auth:false})
        console.log('Enter page as non-user')
        v.redirect()
      }
    })
    let currentDate = new Date()
    let parsedDate = parseDate(currentDate)
    this.$store.commit('setCurrentDate', {currentDate: currentDate}) //Pointing the date to current date
    this.$store.commit('setDisplayDate',{displayDate: currentDate})
    this.$store.commit('setParsedDisplayDateInHyphen',{date: parsedDate}) //Set the display date on current date
    this.$store.commit('setParsedCurrentDateInHyphen',{date: parsedDate}) //Set the display date on current date
    document.body.addEventListener('mouseup',function(){
        v.activeElement = document.activeElement.tagName
    })
  },
  watch:{
    // Helper for closing popup when clicking outside dropdown
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