<template>
    <v-dialog
        v-model="show"
        max-width="290"
    >
        <v-card>
            <v-card-title class="headline">Delete "{{title}}" ?</v-card-title>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="grey darken-1"
                text
                @click="dismiss()"
            >
                No
            </v-btn>
            <v-btn
                color="red darken-1"
                text
                @click="confirm()"
            >
                Delete
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ConfirmDeletePopup',
    props:[
        'show',
        'title'
    ],
    data(){
        return{   
        }
    },
    methods:{
        confirm(){
            this.$emit('confirm')
        },
        disimss(){
            this.$emit('dismiss')
        }
    },
}
</script>

<style>

</style>