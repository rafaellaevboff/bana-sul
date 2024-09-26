<template>
  <v-card class="pa-6">
    <v-img :src="Logo" max-height="150" class="mb-4"/>
    <v-card-title class="text-h5">Registrar novo agricultor</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="register">
        <v-text-field v-model="newName" label="Nome" type="name" required></v-text-field>
        <v-text-field v-model="newPhone" label="Telefone" type="telefone" required/>
        <v-text-field v-model="newEmail" label="Email" type="email" required/>
        <v-text-field v-model="newPassword" label="Senha" :type="passwordVisible ? 'text' : 'password'"
                      append-icon="mdi-eye" @click:append="togglePasswordVisibility" required/>
        <v-btn type="submit" class="mt-3" block>Registrar</v-btn>
        <v-btn class="clickable mt-3" @click="handleLogin" block>{{ "Entrar" }}</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {goToLogin} from "@/services/formsService";
import {auth} from "@/services/firebase";
import Logo from '../assets/LogoBanaSul.png';
import {newUser} from "@/services/userService";

const router = useRouter();
const newName = ref("");
const newPhone = ref("");
const newEmail = ref("");
const newPassword = ref("");
const passwordVisible = ref(false);
const db = getFirestore();

const handleLogin = () => goToLogin(router);

const register = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            newEmail.value,
            newPassword.value
        );
        const user = userCredential.user

        await newUser(db, user.uid, newName.value, newEmail.value, newPhone.value);

        alert("Usuário registrado com sucesso!");
        console.log("Usuário registrado: ", userCredential.user);
    } catch (error) {
        alert(`Erro de registro: ${error.message}`);
    }
};

const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
};
</script>

<style>
input {
    display: block;
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    max-width: 300px;
}

button:hover {
    background-color: #fbd303;
}
</style>
