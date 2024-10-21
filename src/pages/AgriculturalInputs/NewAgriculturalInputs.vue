<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Cadastro de Insumo</h1>

        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field v-model="insumo.name" label="Nome do Insumo" :rules="[rules.required]" outlined required
                        rounded variant="outlined" density="compact"/>

          <v-textarea v-model="insumo.descricao" label="Descrição" :rules="[rules.required]" required
                      rounded variant="outlined" density="compact"/>

          <v-text-field v-model="insumo.valor" label="Valor" :rules="[rules.required, rules.isNumber]" outlined required
                        rounded variant="outlined" density="compact"/>

          <v-btn type="submit" :style="{ width: '30%' }" :disabled="!valid" class="bg-primary" rounded>Cadastrar</v-btn>
        </v-form>

        <feedback-message v-model="snackbar" :message="message.value" :color="color.value"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref} from 'vue';
import {newAgriculturalInput} from "@/services/agriculturalInputsService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";

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
const color = ref('');
const message = ref('');

const submit = () => {
    try {
        if (valid.value) {
            console.log("Insumo cadastrado: ", insumo.value);
            newAgriculturalInput(crypto.randomUUID(), insumo.value.name, insumo.value.descricao, insumo.value.valor)

            message.value = 'Insumo cadastrado com sucesso!'
            color.value = 'green'
            snackbar.value = true;

            insumo.value = {name: '', descricao: '', valor: ''};
        }
    } catch (error) {
        message.value = error
        color.value = 'red'
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
