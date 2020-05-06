<template>
    <v-fade-transition>
        <v-card
        class="absolute editPriorityPanel"
        elevation="4"
        >
        <v-card-text class="pa-0">
            <!-- <v-list-item v-for="(item,index) in priorityList" :key="index" @click="editPriority(index)" class="px-6">
                <v-list-item-title>
                    <div class="colorCircle" :style="{background: item.color}"></div>
                    <v-icon :color="item.color" small>flag</v-icon>
                </v-list-item-title>
            </v-list-item> -->
            <v-btn-toggle border-less dense tile v-model="selectedPriority">
                <v-tooltip bottom transition="fade" v-for="(item,index) in priorityList" :key="index" light>
                    <template v-slot:activator="{ on }">
                        <v-btn :ripple="false" icon v-on="on">
                            <v-icon :color="item.color" small value="index" @click="editPriority(index)">flag</v-icon>
                        </v-btn>
                    </template>
                    <span class="caption">Priority {{item.value}}</span>
                </v-tooltip>
            </v-btn-toggle>
        </v-card-text>
        </v-card>
    </v-fade-transition>
</template>

<script>
export default {
    name: 'EditPriorityPanel',
    props:[
        'priority'
    ],
    data(){
        return{
            selectedPriority: '',
            priorityList:[
                {
                    color:'#E57373',
                    value: 3
                },
                {
                    color:'#FDD835',
                    value: 2
                },
                {
                    color: '#64B5F6',
                    value: 1
                },
                {
                    color: '#BDBDBD',
                    value: 0
                },
            ],
        }
    },
    computed: {
    },
    methods:{
        editPriority(index){
            this.$emit('editPriority',[this.priorityList[index]])
        },
    },
    created(){
        this.selectedPriority = this.priority
    }
}
</script>

<style>
.absolute{
    position:absolute;
}
.colorCircle{
    width:9px;
    height: 9px;
    margin-right:5px;
    display:inline-block;
    border-radius:50%;
    align-self: baseline;
}
.editPriorityPanel{
    right:72px;
    top:40px;
    z-index: 100;
}
</style>