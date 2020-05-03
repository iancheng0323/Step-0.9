<template>
    <v-fade-transition>
        <v-card
        class="editLabelPanel absolute"
        elevation="4"
        >
        <v-card-text class="pa-4">
            <v-combobox
                autofocus
                width="500"
                outlined
                dense
                multiple
                label="Labels"
                no-data-text="no data"
                small-chips
                :menu-props="menuProps"
                :items="labels"
                placeholder="Type in to create new labels."
                @blur="save()"
                hide-details
                v-model="value"
                >
            </v-combobox>
        </v-card-text>
        </v-card>
    </v-fade-transition>
</template>

<script>
export default {
    name: 'EditLabelPanel',
    props:[
        
    ],
    data(){
        return{
            labels:[
                'a',
                'b',
                'c',
                'd'
            ],
            menuProps:{ 
                closeOnClick : false,
                openOnClick: false,
                closeOnContentClick : false,
                disableKeys : true,
                maxHeight : 150 },
            value: [],
        }
    },
    computed: {
    },
    methods:{
        save(){
            console.log(this.value)
            this.$emit('save')
        },
    },
}
</script>

<style>
.absolute{
    position:absolute;
}
.editLabelPanel{
    width:300px;
    right:60px;
    top:30px;
    z-index: 100;
}
</style>