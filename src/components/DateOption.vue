<template>
    <v-scale-transition
    origin="top left">
        <v-card 
        class="dateOption"
        elevation="4"
        >
            <v-list dense class="pa-0">
                    <v-list-item
                    class="text-uppercase" 
                    @click="setDateOption(0)"
                    >
                        <v-list-item-content>
                            <v-list-item-title 
                            >
                            Today
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item
                    @click="setDateOption(1)"
                    class="text-uppercase" 
                    >
                        <v-list-item-content>
                            <v-list-item-title 
                            >
                            Next 7 Days
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
            </v-list>
        </v-card>
    </v-scale-transition>

</template>

<script>
export default {
    name: 'DateOption',
    props:[
    ],
    data(){
        return{
        }
    },
    computed: {
    },
    methods:{
        setDateOption(option){
            this.$emit('setDateOption',option)
        }
    },
}
</script>

<style>
.dateOption{
    width:160px;
    left:4px;
    top:4px;
    z-index: 100;
}
</style>