<template>
    <v-expand-transition>
        <v-card 
        class="actionMenu"
        elevation="1"
        transition="scroll-y-transition">
            <v-list dense>
                    <v-list-item
                    @click="addRoutine()"
                    class="text-uppercase" 
                    >
                        <v-list-item-content>
                            <v-list-item-title 
                            >
                            Add Routine
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item
                    @click="addDivider()"
                    class="text-uppercase" 
                    >
                        <v-list-item-content>
                            <v-list-item-title 
                            >
                            Add Divider
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
            </v-list>
        </v-card>
    </v-expand-transition>

</template>

<script>
export default {
    name: 'TodoMainActionMenu',
    props:[
    ],
    data(){
        return{
        }
    },
    computed: {
    },
    methods:{
        addDivider(){
            this.$emit('addDivider')
        },
        addRoutine(){
            this.$emit('addRoutine')
        },
    },
}
</script>

<style>
.actionMenu{
    width:200px;
    right:8px;
    top:24px;
    z-index: 100;
}
</style>