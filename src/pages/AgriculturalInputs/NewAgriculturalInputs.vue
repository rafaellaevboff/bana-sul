<template>
  <v-container>
    <h1 class="display-1 text-center">Cadastro de Insumo</h1>

    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <v-text-field v-model="insumo.name" label="Nome do Insumo" :rules="[rules.required]" outlined required/>

      <v-textarea v-model="insumo.descricao" label="Descrição" :rules="[rules.required]" outlined required/>

      <v-text-field v-model="insumo.valor" label="Valor" :rules="[rules.required, rules.isNumber]" outlined required/>

      <v-btn type="submit" :disabled="!valid" style="background-color: #f9d200">Cadastrar</v-btn>
    </v-form>

    <v-snackbar v-model="snackbar" color="success">
      Insumo cadastrado com sucesso!
    </v-snackbar>
  </v-container>
</template>

<script setup>
import {ref} from 'vue';
import {newAgriculturalInput} from "@/services/agriculturalInputsService";

const insumo = ref({
    name: '',
    descricao: '',
    valor: ''
});
const valid = ref(false);
const rules = {
    required: value => !!value || 'Campo obrigatório',
    isNumber: value => !isNaN(value) || 'Deve ser um número válido'
};

const snackbar = ref(false);

const submit = () => {
    if (valid.value) {
        console.log("Insumo cadastrado: ", insumo.value);
        newAgriculturalInput(crypto.randomUUID(), insumo.value.name, insumo.value.descricao, insumo.value.valor)
        insumo.value = {name: '', descricao: '', valor: ''};
        snackbar.value = true;
    }
};
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}

v-form {
    max-width: 600px;
    margin: 0 auto;
}
</style>
