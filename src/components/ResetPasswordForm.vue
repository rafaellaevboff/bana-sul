<template>
  <v-card class="pa-6">
    <v-img :src="Logo" max-height="150" class="mb-4"/>
    <v-card-title class="text-h5">Recuperar Senha</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="resetPassword">
        <v-text-field v-model="emailReset" label="Email" type="email" required rounded variant="outlined" density="compact"/>
        <v-btn type="submit" block>Redefinir senha</v-btn>
        <v-btn @click="handleLogin" class="mt-3" block>Entrar</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {sendPasswordResetEmail} from "firebase/auth";
import {goToLogin} from "@/services/formsService";
import {auth} from "@/plugins/firebase";
import Logo from '../assets/LogoBanaSul.png';

const router = useRouter();
const emailReset = ref("");

const handleLogin = () => goToLogin(router);

const resetPassword = async () => {
    try {
        await sendPasswordResetEmail(
            auth,
            emailReset.value
        );
        alert("Email enviado com sucesso!");

    } catch (error) {
        alert("Erro ao enviar e-mail: ", error);
    }
};

</script>

<style></style>
