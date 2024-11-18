<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title class="headline">Editar Caderno</v-card-title>
      <v-card-text>
        <v-text-field v-model="editedItem.nome" label="Nome" required/>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel" color="grey darken-1">Cancelar</v-btn>
        <v-btn @click="confirmEdit" color="blue">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from "vue";

const props = defineProps({
    modelValue: Boolean,
    item: Object,
});

const emit = defineEmits(["update:modelValue", "editConfirmed"]);

const isOpen = ref(props.modelValue);

const editedItem = ref({...props.item});

const cancel = () => {
    emit("update:modelValue", false);
};

const confirmEdit = () => {
    emit("editConfirmed", editedItem.value);
    emit("update:modelValue", false);
};

watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue;
    if (newValue) {
        editedItem.value = {...props.item};
    }
});
</script>

<style scoped>
</style>
