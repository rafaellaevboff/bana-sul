<template>
  <v-card class="pa-6">
    <v-img :src="Logo" max-height="150" class="mb-4"/>
    <v-card-title class="text-h5">Recuperar Senha</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="resetPassword">
        <v-text-field v-model="emailReset" label="Email" type="email" required rounded variant="outlined" density="compact"/>
        <v-btn class="mt-3" type="submit" block color="primary" rounded>Redefinir senha</v-btn>
        <v-btn class="mt-3" type="submit" block color="primary" rounded @click="handleLogin">Entrar</v-btn>
      </v-form>
    </v-card-text>

    <v-alert v-if="error" type="error" variant="tonal" border="start" color="red lighten-3"
             icon="mdi-alert-circle-outline" class="mb-4" rounded>
      {{ error }}
    </v-alert>

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
const error = ref("");

const handleLogin = () => goToLogin(router);

const resetPassword = async () => {
    try {
        error.value = "";
        await sendPasswordResetEmail(auth, emailReset.value);
        alert("Email enviado com sucesso!");
    } catch (err) {
        error.value = `Erro ao enviar e-mail.`;
    } finally{
        if (error.value) {
            setTimeout(() => {
                error.value = "";
            }, 6000);
        }
    }
};

</script>

<style></style>
