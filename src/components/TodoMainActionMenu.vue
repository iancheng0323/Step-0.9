<template>
    <v-expand-transition>
        <v-card 
        class="actionMenu"
        elevation="4"
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
                    <v-divider></v-divider>
                    <v-list-item
                    @click="toggleHideDone()"
                    class="text-uppercase"
                    >
                        <v-list-item-content>
                            <v-list-item-title
                            >
                            <span>{{hideDoneText}}</span>
                            </v-list-item-title>
                            
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    @click="toggleSortByPriority()"
                    class="text-uppercase"
                    >
                        <v-list-item-content>
                            <v-list-item-title
                            >
                            <span>{{sortByPriorityText}}</span>
                            </v-list-item-title>
                            
                        </v-list-item-content>
                    </v-list-item>
            </v-list>
        </v-card>
    </v-expand-transition>

</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'TodoMainActionMenu',
    props:[
        'sortByPriority'
    ],
    data(){
        return{
            hideDoneText: 'Show Done',
            // sortByPriorityText: 'Sort By Priority ✅'
        }
    },
    computed: {
        // hideDoneText(){
            // if(this.userInfo.opt.hideDone){
            //     return 'Show Done'
            // }else{
            //     return 'Hide Done'
            // }
        // },
        hideDone(){
            return this.userInfo.opt.hideDone
        },
        sortByPriorityText(){
            return this.sortByPriority ? 'Sort By Priority ✅' :'Sort By Priority ⛔️'
        },
        ...mapState([
            'userInfo'
        ]),
    },
    methods:{
        addDivider(){
            this.$emit('addDivider')
        },
        addRoutine(){
            this.$emit('addRoutine')
        },
        toggleHideDone(){
            this.$emit('toggleHideDone')
        },
        toggleSortByPriority(){
            this.$emit('toggleSortByPriority')
        }
    },
    watch:{
        userInfo(){
            this.hideDoneText = this.userInfo.opt.hideDone? 'Show Done' : 'Hide Done'
        }
    }
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