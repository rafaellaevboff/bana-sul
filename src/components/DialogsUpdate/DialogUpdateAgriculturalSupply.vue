<template>
  <base-dialog-update v-model="isOpen" title="Editar Insumo"
                      :confirmText="'Salvar'" :cancelText="'Cancelar'"
                      @confirmed="confirmEdit" @cancelled="cancelEdit">
    <template #content>
        <v-text-field v-model="editedItem.nome" label="Nome" required/>
        <v-text-field v-model="editedItem.descricao" label="Descricao" required/>
      <v-text-field v-model="editedItem.valor" label="Valor (R$)" required type="number">
        <template v-slot:prepend-item>
          <span>R$</span>
        </template>
      </v-text-field>
    </template>
  </base-dialog-update>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
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
