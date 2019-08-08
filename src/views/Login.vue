<template>
    <v-container fill-height>
        <v-layout align-center align-content-center fill-height justify-center>
            <v-flex md3>
                <v-card class="loginForm text-center pt-4">
                    <v-container class="text-center">
                        <h1 class="text-center headline">Join Steps Now.</h1>
                        <v-card-actions>
                            <v-container class="text-center">
                                <v-btn 
                                large
                                depressed
                                @click="signInWithGoogle"
                                > 
                                    <img class="btnIcon" src="../assets/google.png"/>
                                    Sign In With Google
                                </v-btn>
                            </v-container>
                        </v-card-actions>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    data: function(){
        return{
        }
    },
    props: [
        'auth'
    ],
    methods:{
        signInWithGoogle:function(){
            this.$emit('signInWithGoogle')
        },
    },
    watch:{
        auth: function(){
            if(this.auth == true){
                console.log('oasuhfoan')
                this.$router.push({ path: '/' })
            }
        },
    },
    created: function(){
        if(this.auth == true){
            this.$router.push({ path: '/' })
        }
    }
}
</script>
<style scoped>
.loginForm{
    min-height:150px;
}
.btnIcon{
    width:15px;
    margin-right:5px;
}
</style>
