<template>
  <v-card/>
</template>

<script setup>
import {onMounted} from "vue";
import {getItemById} from "@/services/essentialFunctions";

const props = defineProps(['id']);
onMounted(async () => {
    await getItemById("cadernos", props.id)
});
</script>

<style scoped>

</style>