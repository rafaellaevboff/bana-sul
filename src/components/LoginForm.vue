<template>
  <v-card class="pa-8">
    <v-card-title class="text-h5">Bem vindo(a)!</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
        <v-text-field
          v-model="password"
          label="Senha"
          :type="passwordVisible ? 'text' : 'password'"
          :append-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="togglePasswordVisibility"
          required
        ></v-text-field>
        <span class="clickablePassword" @click="handleResetPassword">Esqueci minha senha</span>
        <v-btn type="submit" block>Entrar</v-btn>
        <v-btn @click="handleRegistration" block>Cadastrar-se</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref } from "vue";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { goToResetPassword, goToRegistration } from "../services/formsService";

export default {
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const passwordVisible = ref(false);

    const handleRegistration = () => goToRegistration(router);
    const handleResetPassword = () => goToResetPassword(router);

    const login = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        alert("Login bem-sucedido!");
        console.log("Usuário logado:", userCredential.user);
        router.push("/cadastro");
      } catch (error) {
        alert(`Erro de login: ${error.message}`);
      }
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    return {
      email,
      password,
      passwordVisible,
      handleRegistration,
      handleResetPassword,
      login,
      togglePasswordVisibility,
    };
  },
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
  background-color: #218838;
}

.clickablePassword:hover {
  cursor: pointer;
  color: #218838;
}
</style>
