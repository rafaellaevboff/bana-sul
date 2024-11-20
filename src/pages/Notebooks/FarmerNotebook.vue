<template>
  <v-card/>
</template>

<script setup>
import {onMounted} from "vue";
import {getItemById} from "@/services/essentialFunctions";
import {saldoAgricultor} from "@/services/notebookService";

const props = defineProps(['id']);
onMounted(async () => {
    await getItemById("cadernos", props.id)
    await saldoAgricultor(props.id)
});
</script>

<style scoped>

</style>