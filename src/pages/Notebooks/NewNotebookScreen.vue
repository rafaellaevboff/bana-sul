<template>
  <v-container>

    <v-row>
      <v-col>
        <h2>Criação de Novo Caderno e Novo Usuário</h2>
      </v-col>
    </v-row>


    <v-form v-model="valid" @submit.prevent="registerUser">
      <v-text-field
              v-model="newNotebookFarmer.userName"
              label="Nome do Usuário" required
              :rules="[v => !!v || 'Nome é obrigatório']"/>

      <v-text-field
              v-model="newNotebookFarmer.email"
              label="Email" type="email" required
              :rules="[v => !!v || 'Email é obrigatório', v => /.+@.+\..+/.test(v) || 'Email inválido']"/>

      <v-text-field
              v-model="newNotebookFarmer.password"
              label="Senha" type="password" required
              :rules="[v => !!v || 'Senha é obrigatória', v => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres']"/>

      <v-btn type="submit" :disabled="!valid">Cadastrar</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';
import {newUser} from "@/services/userService";
import {newNotebook} from "@/services/notebookService";

const newNotebookFarmer = ref({
    userName: '',
    email: '',
    password: ''
})
const valid = ref(false);
const auth = getAuth();
const db = getFirestore();

const registerUser = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            newNotebookFarmer.value.email,
            newNotebookFarmer.value.password
        );
        const user = userCredential.user

        await newUser(db, user.uid, newNotebookFarmer.value.userName, newNotebookFarmer.value.email);
        await newNotebook(db, newNotebookFarmer.value.userName, user.uid)

        alert("Usuário registrado com sucesso!");
        console.log("Usuário registrado: ", userCredential.user);

        newNotebookFarmer.value = {
            userName: '',
            email: '',
            password: ''
        }
    } catch (error) {
        alert(`Erro de registro: ${error.message}`);
    }
};
</script>

<style scoped>

</style>