<template>
    <v-snackbar 
    v-model="snackbarControl" 
    :timeout="2000" 
    :color="snackbarColor" 
    class="text-center">
        {{snackbarMessage}}
    </v-snackbar>
</template>

<script>
export default {
    name: 'Snackbar',
    props: [
        'snackbarControl',
        'snackbarColor',
        'snackbarMessage',
    ]
}
</script>

<style>

</style>