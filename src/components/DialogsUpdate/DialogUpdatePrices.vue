<template>
    <base-dialog-update v-model="isOpen" title="Editar Preços"
                        :confirmText="'Salvar'" :cancelText="'Cancelar'"
                        @confirmed="confirmEdit" @cancelled="cancelEdit">

      <template #content>
        <v-text-field v-model="editedItem.prataPrimeira" label="Prata 1ª (R$)" required type="number"/>
        <v-text-field v-model="editedItem.prataSegunda" label="Prata 2ª (R$)" required type="number"/>
        <v-text-field v-model="editedItem.caturraPrimeira" label="Caturra 1ª (R$)" required type="number"/>
        <v-text-field v-model="editedItem.caturraSegunda" label="Caturra 2ª (R$)" required type="number"/>
        <h5>ATENÇÃO</h5>
        <span style="font-size: 15px">Ao editar os preços das caixas de banana, os valores das colheitas já cadastradas com esses preços não serão alterados.</span>
      </template>
    </base-dialog-update>
</template>

<script setup>
import {defineEmits, defineProps, onMounted, ref, watch} from "vue";
import BaseDialogUpdate from "@/components/DialogsUpdate/BaseDialogUpdate.vue";

const props = defineProps({
    modelValue: Boolean,
    item: {type: Object, required: true},
});

const emit = defineEmits(["update:modelValue", "editConfirmed"]);

const isOpen = ref(props.modelValue);
const editedItem = ref({...props.item});

onMounted(async () => {
    console.log("edited item: ", props.item)
})

const confirmEdit = () => {
    emit("editConfirmed", editedItem.value);
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
