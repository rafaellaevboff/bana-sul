<template>
  <v-card class="pa-8">
    <v-img :src="Logo" max-height="150" class="mb-4"/>

    <v-card-title class="text-h5 text-center">Bem-vindo(a)!</v-card-title>
    <v-card-text>

      <v-form @submit.prevent="loginApp">
        <v-text-field v-model="email" label="Email" type="email" required rounded variant="outlined" density="compact"
        />
        <v-text-field v-model="password" label="Senha" :type="passwordVisible ? 'text' : 'password'" required
                      :append-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="togglePasswordVisibility" rounded variant="outlined" density="compact"/>

        <span class="clickablePassword" @click="handleResetPassword">Esqueci minha senha</span>

        <v-btn class="mt-3" type="submit" block color="primary" rounded>Entrar</v-btn>
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
import {goToResetPassword} from "@/services/formsService";
import {login} from "@/services/loginService";
import Logo from "../assets/LogoBanaSul.png";

const router = useRouter();
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);
const error = ref("");

const handleResetPassword = () => goToResetPassword(router);

const loginApp = async () => {
    try {
        error.value = "";
        await login(router, email, password, (err) => (error.value = err));
    } catch (err) {
        error.value = `Erro ao fazer login: ${err}`;
    } finally{
        if (error.value) {
            setTimeout(() => {
                error.value = "";
            }, 6000);
        }
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
    background-color: #fb0202;
}

.clickablePassword:hover {
    cursor: pointer;
    color: #606060;
}
</style>
