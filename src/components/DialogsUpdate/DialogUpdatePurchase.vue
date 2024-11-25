<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title class="headline">Editar Status</v-card-title>
      <v-card-text>
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
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
    modelValue: Boolean,
    item: Object,
});

const emit = defineEmits(["update:modelValue", "editConfirmed"]);

const isOpen = ref(props.modelValue);
const editedItem = ref({ ...props.item });

const cancel = () => {
    emit("update:modelValue", false);
};

const confirmEdit = () => {
    emit("editConfirmed", editedItem.value);
    emit("update:modelValue", false);
};

watch(
    () => props.modelValue,
    (newValue) => {
        isOpen.value = newValue;
        if (newValue) {
            editedItem.value = { ...props.item };
        }
    }
);

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
