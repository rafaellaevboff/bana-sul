<template>
  <v-snackbar v-model="localVisible" :timeout="5000" :color="color" location="bottom center" class="snackbar-content">
    <div class="text-center">{{ message }}</div>
  </v-snackbar>
</template>

<script setup>
import {ref, watch} from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const localVisible = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    localVisible.value = newValue;
});

watch(localVisible, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>

<style scoped>
.snackbar-content {
    text-align: center;
}
</style>
