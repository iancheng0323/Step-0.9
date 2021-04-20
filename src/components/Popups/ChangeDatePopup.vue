<template>
    <v-dialog 
    :value="show" 
    @click:outside="close()" 
    width="300">
        <v-date-picker v-model="datePickerValue">
            <v-btn color="primary" large @click="returnDate(datePickerValue)">Move</v-btn>
            <v-btn large @click="returnDate('')">No Date</v-btn>
        </v-date-picker>
    </v-dialog>
</template>

<script>
export default {
    name: "ChangeDatePopup",
    props:[
        'show',
        'defaultValue'
    ],
    data(){
        return{
        datePickerValue: ''
        }
    },
    created(){
        this.datePickerValue = this.defaultValue
    },
    methods:{
        returnDate(date){
            this.$emit(
                'returnDate',
                {
                    date: date
                }
            )
        },
        close(){
            this.$emit('close')
        }
    }
}
</script>

<style>

</style>