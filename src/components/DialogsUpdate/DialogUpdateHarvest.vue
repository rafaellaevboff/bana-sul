<template>
  <base-dialog-update v-model="isOpen" title="Editar Colheita"
                      :confirmText="'Salvar'" :cancelText="'Cancelar'"
                      @confirmed="confirmEdit" @cancelled="cancelEdit">
    <template #content>
        <v-text-field v-model="editedItem.prataPrimeira" label="Quantidade Prata Primeira" required type="number"/>
        <v-text-field v-model="editedItem.prataSegunda" label="Quantidade Prata Segunda" required type="number"/>
        <v-text-field v-model="editedItem.caturraPrimeira" label="Quantidade Caturra Primeira" required type="number"/>
        <v-text-field v-model="editedItem.caturraSegunda" label="Quantidade Caturra Segunda" required type="number"/>
    </template>
  </base-dialog-update>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from "vue";
import BaseDialogUpdate from "@/components/DialogsUpdate/BaseDialogUpdate.vue";

const props = defineProps({
    modelValue: Boolean,
    item: {type: Object, required: true},
});

const emit = defineEmits(["update:modelValue", "editConfirmed"]);

const isOpen = ref(props.modelValue);
const editedItem = ref({...props.item});

const confirmEdit = () => {
    emit("editConfirmed", {...editedItem.value});
    emit("update:modelValue", false);
};

const cancelEdit = () => {
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
