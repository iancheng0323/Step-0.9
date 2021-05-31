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
                    v-if="parsedDisplayDateInHyphen != parsedCurrentDateInHyphen || status == 3 || inOverDue"
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
        'parsedCurrentDateInHyphen',
        'inOverDue'
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