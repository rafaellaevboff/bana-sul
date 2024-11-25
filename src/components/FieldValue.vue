<template>
  <v-text-field :label="label" v-model="localValue" type="text" required rounded
                variant="outlined" density="compact" :rules="[valorRequerido]"
                @input="emitValorFormatado"/>
</template>

<script setup>
import {ref, watch} from "vue";
import {defineProps, defineEmits} from "vue";

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: "",
    },
    label: {
        type: String,
        default: "Valor",
    },
});

const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);

const valorRequerido = (value) => {
    if (value === "" || value === null) return true;
    return !!value || "Este campo é obrigatório";
};

const formatarValor = (valor) => {
    const valorLimpo = valor.replace(/\D/g, "");
    if (!valorLimpo) return "";

    const reais = parseInt(valorLimpo.slice(0, -2), 10) || 0;
    const centavos = valorLimpo.slice(-2).padStart(2, "0");

    return `${reais > 0 ? reais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0"},${centavos}`;
};

const emitValorFormatado = () => {
    const valorLimpo = localValue.value.replace(/\D/g, "");
    const reais = parseInt(valorLimpo.slice(0, -2), 10) || 0;
    const centavos = valorLimpo.slice(-2).padStart(2, "0");
    const valorSemPrefixo = `${reais}.${centavos}`;

    emit("update:modelValue", valorSemPrefixo);
};

watch(
    () => props.modelValue,
    (newValue) => {
        localValue.value = newValue ? `R$ ${formatarValor(newValue.toString())}` : "";
    }
);
</script>
