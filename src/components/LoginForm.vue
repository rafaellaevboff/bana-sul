<template>
  <v-card class="pa-8">
    <v-img :src="Logo" max-height="150" class="mb-4"/>

    <v-card-title class="text-h5">Bem vindo(a)!</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="loginApp">
        <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
        <v-text-field
                v-model="password"
                label="Senha"
                :type="passwordVisible ? 'text' : 'password'"
                :append-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="togglePasswordVisibility"
                required
        />
        <span class="clickablePassword" @click="handleResetPassword">Esqueci minha senha</span>
        <v-btn class="mt-3" type="submit" block>Entrar</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {goToResetPassword} from "@/services/formsService";
import {login} from '@/services/loginService'
import Logo from '../assets/LogoBanaSul.png';

const router = useRouter();
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);

const handleResetPassword = () => goToResetPassword(router);

const loginApp = async () => {
    try {
        await login(router, email, password)
    } catch (error) {
        alert(`Erro de login: ${error.message}`);
    }
};

const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
}
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
    background-color: #fbd102;
}

.clickablePassword:hover {
    cursor: pointer;
    color: #606060;
}
</style>
