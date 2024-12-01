<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        <slot name="content" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel" color="white" style="background-color: #fb0202" class="btn-hover">{{ cancelText }}</v-btn>
        <v-btn @click="confirm" color="white" style="background-color: forestgreen" class="btn-hover">{{ confirmText }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
    modelValue: Boolean,
    title: { type: String, required: true },
    cancelText: { type: String, default: "Cancelar" },
    confirmText: { type: String, default: "Salvar" },
});

const emit = defineEmits(["update:modelValue", "confirmed", "cancelled"]);

const isOpen = ref(props.modelValue);

const cancel = () => {
    emit("cancelled");
    emit("update:modelValue", false);
};

const confirm = () => {
    emit("confirmed");
    emit("update:modelValue", false);
};

watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue;
});
</script>

<style scoped>
.btn-hover:hover {
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.2);
}
</style>
