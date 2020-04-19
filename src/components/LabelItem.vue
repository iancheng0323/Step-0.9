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
                    <v-select
                    v-model="selectedColor"
                    :items="defaultColorChoices"
                    label="color"
                    placeholder="Set a color for the label"
                    >
                    </v-select>
                <v-btn @click="deleteLabel" class="editRoutineFormButton">Delete</v-btn>
                </v-form>
            </v-card-text>
                <v-btn @click="editLabel" class="editRoutineFormButton">Edit</v-btn>
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
        'text',
        'defaultColorChoices',
        'index'
    ],
    data(){
        return{
            editPop: false,
            editedLabelName: '',
            selectedColor:''
        }
    },
    created(){
        this.editedLabelName = this.text
        this.selectedColor = this.color
    },
    methods:{
        editLabel(){
            if(this.selectedColor !== '' &&
            this.editedLabelName !== ''
            ){
                let props = {
                    color: this.selectedColor,
                    text: this.editedLabelName,
                    index: this.index
                }
                this.$emit('editLable', props)
            }
            this.editPop = false
        },
        deleteLabel(){
            let props = {
                index: this.index
            }
            this.$emit('deleteLabel',props)
            this.editPop = false
        }
    }

}
</script>

<style>
.inline-block{
    display: inline-block;
}
</style>