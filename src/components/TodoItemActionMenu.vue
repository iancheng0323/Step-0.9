<template>
    <v-expand-transition>
        <v-card 
        class="todoItemActionMenu absolute"
        elevation="4"
        transition="scroll-y-transition">
            <v-list dense>
                    <v-list-item
                    @click="moveToToday"
                    class="" 
                    v-if="parsedDisplayDateInHyphen != parsedCurrentDateInHyphen || status == 3"
                    >
                        <v-list-item-icon class="mr-2">
                            <v-icon dense>today</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Move to today</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    @click.stop="showDatePicker"
                    class=""
                    >
                        <v-list-item-icon class="mr-2">
                            <v-icon dense>date_range</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Move to date ...</v-list-item-title>
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
                    <!-- <v-divider></v-divider>
                    <v-list-group
                    class="text-uppercase" 
                    >
                    <template v-slot:activator>
                    <v-list-item-title>Add Color</v-list-item-title>
                    </template>
                        <v-list-item-group>
                            <v-list-item v-for="(item,index) in colorList" :key="index" @click="paintColor(index)">
                                <v-list-item-title>
                                <div class="colorCircle" :style="{background: item.color}"></div>{{item.text}}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list-group> -->
                    <v-divider></v-divider>
                    <v-list-item
                    @click="deletePop"
                    class="" 
                    >
                        <v-list-item-icon class="mr-2">
                            <v-icon dense>delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Delete</v-list-item-title>
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
            colorList:[
                {
                    text: 'Red',
                    color:'#E57373'
                },
                {
                    text: 'Yellow',
                    color:'#FDD835'
                },
                {
                    text: 'Green',
                    color: '#81C784'
                },
                {
                    text: 'Blue',
                    color:'#64B5F6'
                },
                {
                    text: 'Grey',
                    color: '#BDBDBD'
                },
            ]
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
            this.$emit('paintColor',[this.colorList[index].color])
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
.todoItemActionMenu{
    right:15px;
    top:30px;
    z-index: 100;
}
</style>