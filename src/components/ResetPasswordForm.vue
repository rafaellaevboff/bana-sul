<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5">Recuperar Senha</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="resetPassword">
        <v-text-field
          v-model="emailReset"
          label="Email"
          type="email"
          required
        ></v-text-field>
        <v-btn type="submit" block>Redefinir senha</v-btn>
        <v-btn @click="handleLogin" block>Entrar</v-btn>
        <v-btn @click="handleRegistration" block>Cadastrar-se</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { sendPasswordResetEmail } from "firebase/auth";
import { goToLogin, goToRegistration } from "../services/formsService";
import { auth } from "../services/firebase";

export default {
  setup() {
    const router = useRouter();
    const emailReset = ref("");

    const handleLogin = () => goToLogin(router);
    const handleRegistration = () => goToRegistration(router);

    const resetPassword = async () => {
      try {
        await sendPasswordResetEmail(
          auth,
          emailReset.value
        );
        alert("Email enviado com sucesso!");
        
      } catch (error) {
        alert("Erro ao enviar e-mail: ", error)
      }
    };

    return { emailReset, resetPassword, handleLogin, handleRegistration };
  },
};
</script>

<style></style>
