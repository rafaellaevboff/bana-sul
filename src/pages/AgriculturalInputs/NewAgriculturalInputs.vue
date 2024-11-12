<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Cadastro de Insumo</h1>

        <v-form ref="form" @submit.prevent="submit">
          <v-text-field v-model="insumo.nome" label="Nome do Insumo" :rules="[rules.required]" outlined required
                        rounded variant="outlined" density="compact"/>

          <v-textarea v-model="insumo.descricao" label="Descrição" :rules="[rules.required]" required
                      rounded variant="outlined" density="compact"/>

          <v-text-field v-model="insumo.valor" label="Valor" :rules="[rules.required, rules.isNumber]" outlined required
                        rounded variant="outlined" density="compact"/>

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

const { snackbar, color, message, showMessage } = useShowMessage();

const insumo = ref({
    nome: '',
    descricao: '',
    valor: ''
});
const rules = {
    required: value => !!value || 'Campo obrigatório',
    isNumber: value => !isNaN(value) || 'Deve ser um número válido'
};

const submit = () => {
    try {
        if (!insumo.value.nome && !insumo.value.descricao && !insumo.value.valor) {
            showMessage('Todos os campos devem estar preenchidos.','red')
            return;
        }

        newAgriculturalInput(insumo.value.nome, insumo.value.descricao, insumo.value.valor)

        showMessage('Insumo cadastrado com sucesso!', 'green')
        insumo.value = {nome: '', descricao: '', valor: ''};
    } catch (error) {
        showMessage(error, 'red')
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
