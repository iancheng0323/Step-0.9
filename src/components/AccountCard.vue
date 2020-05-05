<template>
    <v-scale-transition origin="top right 0">
        <v-card light class="mt-12 absolute accountCard">
            <v-card-title class="headline">
                {{userName}}
            </v-card-title>
            <v-card-subtitle>
                {{userEmail}}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-list-item class="pa-0">
                    <v-btn block text color="grey"
                    @click="logout()"
                    >Logout</v-btn>
                </v-list-item>
            </v-card-text>
        </v-card>
    </v-scale-transition>
</template>

<script>
export default {
    name: "AccountCard",
    props:[
        'userName',
        'activeElement',
        'userEmail'
    ],
    methods:{
        logout(){
            this.$emit('logout')
        },
    }

}
</script>

<style>
.accountCard{
  top:0;
  right:16px;
}

</style>