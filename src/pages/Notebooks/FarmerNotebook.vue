<template>
  <v-card/>
</template>

<script setup>
import {onMounted} from "vue";
import {findNotebookById} from "@/services/notebookService";

const props = defineProps(['id']);
onMounted(async () => {
    await findNotebookById(props.id)
});
</script>

<style scoped>

</style>