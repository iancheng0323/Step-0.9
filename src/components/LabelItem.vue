<template>
    <div class="inline-block">
        <v-chip link :color="color"
        @click="editPop = true">
        {{text}}
        </v-chip>
        <v-dialog 
        :value="editPop"
        persistent
        max-width="500">
            <v-card min-height="300" relative>
            <v-container>
            <v-card-text>
                <v-form>
                    <v-text-field
                    autofocus
                    v-model="editedLabelName"
                    label="Label Name"
                    placeholder="Label Name, e.g. Urgent, Leisure, Work">
                    </v-text-field>
                    <v-text-field
                    v-model="editedLabelColor"
                    label="Color"
                    placeholder="Put Hex Value Here">
                    </v-text-field>
                <v-btn @click="deleteRoutine" class="editRoutineFormButton">Delete</v-btn>
                </v-form>
            </v-card-text>
                <v-btn @click="editRoutine" class="editRoutineFormButton">Edit</v-btn>
                <v-btn @click="editPop = false" text class="editRoutineFormButton">Discard</v-btn>
            </v-container>
            </v-card>
        </v-dialog>  
    </div>
</template>

<script>
export default {
    name:'LabelItem',
    props:[
        'color',
        'text'
    ],
    data(){
        return{
            editPop: false,
            editedLabelName: '',
            editedLabelColor: '',
        }
    },

}
</script>

<style>
.inline-block{
    display: inline-block;
}
</style>