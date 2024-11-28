<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Cadastro de Insumo</h1>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4"/>

        <v-form ref="form" @submit.prevent="submit" v-if="!loading">
          <v-text-field v-model="insumo.nome" label="Nome do Insumo" outlined required
                        rounded variant="outlined" density="compact"/>

          <v-textarea v-model="insumo.descricao" label="Descrição" required
                      rounded variant="outlined" density="compact"/>

          <field-value v-model="insumo.valor"/>

          <v-btn type="submit" :style="{ width: '30%' }" class="bg-primary" rounded>Cadastrar</v-btn>
        </v-form>

        <feedback-message v-model="snackbar" :message="message" :color="color"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref} from 'vue';
import {newAgriculturalInput} from "@/services/agriculturalInputsService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {useShowMessage} from "@/composables/useShowMessage";
import FieldValue from "@/components/FieldValue.vue";

const { snackbar, color, message, showMessage } = useShowMessage();

const insumo = ref({
    nome: '',
    descricao: '',
    valor: ''
});

const loading = ref(false)

const submit = async () => {
    try {
      loading.value = true
        await fieldsVerification()
        await newAgriculturalInput(insumo.value.nome, insumo.value.descricao, parseFloat(insumo.value.valor));
        showMessage('Insumo cadastrado com sucesso!', 'green');
        await resetVariables()
    } catch (error) {
        showMessage(error, 'red');
    } finally{
      loading.value = false
    }
}

const fieldsVerification = async () => {
    if (!insumo.value.nome || !insumo.value.descricao || !insumo.value.valor) {
      loading.value = false
        throw new Error("Todos os campos devem estar preenchidos.");
    }
}

const resetVariables = async () => {
    insumo.value.nome = null;
    insumo.value.descricao = null;
    insumo.value.valor = null;
}

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
