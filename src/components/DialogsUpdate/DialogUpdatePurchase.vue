<template>
  <base-dialog-update v-model="isOpen" title="Editar Compra"
                    :confirmText="'Salvar'" :cancelText="'Cancelar'"
                    @confirmed="confirmEdit" @cancelled="cancelEdit">
  <template #content>
    <v-row>
      <v-col cols="6">
        <v-checkbox :label="'Descontado no Caderno'" v-model="editedItem.descontadoCaderno"
                @change="handleSelection('descontadoCaderno')"/>
      </v-col>
      <v-col cols="6">
        <v-checkbox :label="'Pago em dinheiro'" v-model="editedItem.pago"
                @change="handleSelection('pago')"/>
      </v-col>
    </v-row>
  </template>
</base-dialog-update>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
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

const handleSelection = (field) => {
    if (field === "descontadoCaderno") {
        editedItem.value.pago = false;
    } else if (field === "pago") {
        editedItem.value.descontadoCaderno = false;
    }
};
</script>

<style scoped>
</style>
