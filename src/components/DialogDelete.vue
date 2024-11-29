<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title class="headline">Confirmação de Exclusão</v-card-title>
      <v-card-text>
        <p>{{ dialogMessage }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel" color="grey darken-1">Cancelar</v-btn>
        <v-btn @click="confirmDelete" color="red">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed, defineEmits, defineProps, onMounted, ref, watch} from "vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    item: {
        type: String,
        required: true,
        default: "selecionado",
    },
    message: {
      type: String,
      required: false
    }
});

onMounted(async () => {
    console.log("item: ", props.item)
});


const dialogMessage = computed(() => {
    if (props.message) {
        return props.message
    }
    return `Você tem certeza que deseja excluir o item ${ props.item }?`
});

const emit = defineEmits(["update:modelValue", "deleteConfirmed"]);

const isOpen = ref(props.modelValue);

const cancel = () => {
    emit("update:modelValue", false);
};

const confirmDelete = () => {
    emit("deleteConfirmed", props.item.id);
    emit("update:modelValue", false);
};

watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue;
});
</script>

<style scoped>
</style>
