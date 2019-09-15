<template>
    <v-container>
        <h1 class="display-1">My Account</h1>
        <p>Edit Your Profile or anything here. This is not finished.</p>
        <v-btn @click="logout" color="warning">
          Logout <v-icon class="ml-2" small>fa-sign-out-alt</v-icon>
        </v-btn>
    </v-container>
</template>

<script>
export default {
    methods:{
        logout(){
            this.$emit('logout')
        }
    }

}
</script>

<style>

</style>