<template>
    <v-expand-transition>
        <v-card 
        class="actionMenu absolute"
        elevation="1"
        transition="scroll-y-transition">
            <v-list dense>
                    <v-list-item
                    @click="moveToToday"
                    class="text-uppercase" 
                    v-if="parsedDisplayDateInHyphen != parsedCurrentDateInHyphen || status == 3"
                    >
                        <v-list-item-content>
                            <v-list-item-title 
                            >
                            Move To Today
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    @click.stop="showDatePicker"
                    class="text-uppercase" 
                    >
                        <v-list-item-content>
                            <v-list-item-title 
                            >
                            Move To Date
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- <v-list-item
                    @click="moveToBacklog"
                    class="text-uppercase" 
                    v-if="status != 3"
                    >
                        <v-list-item-content>
                            <v-list-item-title 
                            >
                            Move To Backlog
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item> -->
                    <v-divider></v-divider>
                    <v-list-group
                    class="text-uppercase" 
                    >
                    <template v-slot:activator>
                    <v-list-item-title>Add Label</v-list-item-title>
                    </template>
                        <v-list-item-group>
                            <v-list-item v-for="(item,index) in labels" :key="index" @click="paintColor(index)">
                                <v-list-item-title>
                                <div class="colorCircle" :style="{background: item.color}"></div>{{item.text}}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list-group>
                    <v-divider></v-divider>
                    <v-list-item
                    @click="deletePop"
                    class="text-uppercase" 
                    >
                        <v-list-item-content>
                            <v-list-item-title
                            >
                            Delete
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
            </v-list>
        </v-card>
    </v-expand-transition>

</template>

<script>
export default {
    name: 'TodoItemActionMenu',
    props:[
        'status',
        'parsedDisplayDateInHyphen',
        'parsedCurrentDateInHyphen'
    ],
    data(){
        return{
            // colorList:[
            //     {
            //         colorTitle: 'Red',
            //         color:'#E57373'
            //     },
            //     {
            //         colorTitle: 'Yellow',
            //         color:'#FDD835'
            //     },
            //     {
            //         colorTitle: 'Green',
            //         color: '#81C784'
            //     },
            //     {
            //         colorTitle: 'Blue',
            //         color:'#64B5F6'
            //     },
            //     {
            //         colorTitle: 'Grey',
            //         color: '#BDBDBD'
            //     },
            // ]
        }
    },
    computed: {
        labels(){
            return this.$store.state.otherInfo.labels
        }
    },
    methods:{
        moveToToday(){
            this.$emit('moveToToday')
        },
        showDatePicker(){
            this.$emit('showDatePicker')
        },
        moveToBacklog(){
            this.$emit('moveToBacklog')
        },
        paintColor(index){
            this.$emit('paintColor',[this.labels[index].color])
        },
        deletePop(){
            this.$emit('deletePop')
        }
    },
}
</script>

<style>
.colorCircle{
    width:9px;
    height: 9px;
    margin-right:5px;
    display:inline-block;
    border-radius:50%;
    align-self: baseline;
}
.actionMenu{
    width:200px;
    right:15px;
    top:30px;
    z-index: 100;
}
</style>