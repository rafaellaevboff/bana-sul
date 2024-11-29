<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Novo Caderno e Novo Usuário</h2>
      </v-col>
    </v-row>

    <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4"/>

    <v-container fluid v-if="!loading">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-form @submit.prevent="registerUser">
            <v-text-field v-model="newNotebookFarmer.userName" label="Nome do Usuário" required
                          :rules="[v => !!v || 'Nome é obrigatório']" rounded variant="outlined" density="compact"/>

            <v-text-field v-model="newNotebookFarmer.email" label="Email" type="email" required
                          :rules="[v => !!v || 'Email é obrigatório', v => /.+@.+\..+/.test(v) || 'Email inválido']"
                          rounded variant="outlined" density="compact"/>

            <v-text-field v-model="newNotebookFarmer.password" label="Senha" type="password" required
                          :rules="[v => !!v || 'Senha é obrigatória', v => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres']"
                          rounded variant="outlined" density="compact"/>

            <v-btn type="submit" class="bg-primary" :style="{ width: '30%' }" rounded>
              Cadastrar
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { newUser } from "@/services/userService";
import { newNotebook } from "@/services/notebookService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import { useShowMessage } from "@/composables/useShowMessage";
import axios from "axios";

const { snackbar, color, message, showMessage } = useShowMessage();

const newNotebookFarmer = ref({
  userName: '',
  email: '',
  password: ''
});

const loading = ref(false);

const registerUser = async () => {
  try {
    loading.value = true
    if (!newNotebookFarmer.value.userName || !newNotebookFarmer.value.email || !newNotebookFarmer.value.password) {
      showMessage(`Todos os campos devem estar preenchidos.`, 'red');
      loading.value = false
      return;
    }

    const userCredential = await axios.post(
      'https://us-central1-bana-pds.cloudfunctions.net/createUser', { 
        name: newNotebookFarmer.value.userName,
        email: newNotebookFarmer.value.email,
        password: newNotebookFarmer.value.password 
      }
    );

    const uidUser = userCredential.data;

    await newUser(uidUser, newNotebookFarmer.value.userName, newNotebookFarmer.value.email);
    await newNotebook(newNotebookFarmer.value.userName, uidUser);

    showMessage('Caderno cadastrado com sucesso!', 'green');

    newNotebookFarmer.value = {
      userName: null,
      email: null,
      password: null
    };
  } catch (error) {
    showMessage(error, 'red');
  } finally{
    loading.value = false
  }
};
</script>