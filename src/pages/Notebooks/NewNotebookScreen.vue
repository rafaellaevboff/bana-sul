<template>
  <v-container>

    <v-row>
      <v-col>
        <h2>Novo Caderno e Novo Usuário</h2>
      </v-col>
    </v-row>

    <v-container fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-form v-model="valid" @submit.prevent="registerUser">
            <v-text-field v-model="newNotebookFarmer.userName" label="Nome do Usuário" required
                          :rules="[v => !!v || 'Nome é obrigatório']" rounded variant="outlined" density="compact"/>

            <v-text-field v-model="newNotebookFarmer.email" label="Email" type="email" required
                          :rules="[v => !!v || 'Email é obrigatório', v => /.+@.+\..+/.test(v) || 'Email inválido']"
                          rounded variant="outlined" density="compact"/>

            <v-text-field v-model="newNotebookFarmer.password" label="Senha" type="password" required
                          :rules="[v => !!v || 'Senha é obrigatória', v => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres']"
                          rounded variant="outlined" density="compact"/>

            <v-btn type="submit" class="bg-primary" :style="{ width: '30%' }" rounded>Cadastrar</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>


    <feedback-message v-model="snackbar" :message="message" :color="color"/>
  </v-container>
</template>

<script setup>
import {ref} from 'vue';
import {getAuth} from 'firebase/auth';
import {newUser} from "@/services/userService";
import {newNotebook} from "@/services/notebookService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {newUserLogin} from "@/services/loginService";

const newNotebookFarmer = ref({
    userName: '',
    email: '',
    password: ''
})
const valid = ref(false);
const auth = getAuth();

const snackbar = ref(false);
const color = ref("");
const message = ref("");

const registerUser = async () => {
    try {
        if (!newNotebookFarmer.value.userName || !newNotebookFarmer.value.email || !newNotebookFarmer.value.password) {
            showMessage(`Todos os campos devem estar preenchidos.`, 'red')
            return;
        }

        const userCredential = await newUserLogin(
            auth,
            newNotebookFarmer.value.email,
            newNotebookFarmer.value.password
        );
        const user = userCredential.user

        await newUser(user.uid, newNotebookFarmer.value.userName, newNotebookFarmer.value.email);
        await newNotebook(newNotebookFarmer.value.userName, user.uid)

        showMessage('Caderno cadastrado com sucesso!', 'green')
        console.log("Usuário registrado: ", userCredential.user);

        newNotebookFarmer.value = {
            userName: '',
            email: '',
            password: ''
        }
    } catch (error) {
        showMessage(error, 'red')
    }
};

const showMessage = (msg, colorFeedback) => {
    message.value = msg;
    color.value = colorFeedback;
    snackbar.value = true;
};
</script>

<style scoped>

</style>