<template>
<v-card class="pa-6">
    <v-card-title class="text-h5">Registrar</v-card-title>
    <v-card-text>
        <v-form @submit.prevent="register">
            <v-text-field v-model="newName" label="Nome" type="name" required></v-text-field>
            <v-text-field v-model="newPhone" label="Telefone" type="telefone" required></v-text-field>
            <v-text-field v-model="newEmail" label="Email" type="email" required></v-text-field>
            <v-text-field v-model="newpassword" label="Senha" :type="passwordVisible ? 'text' : 'password'" append-icon="mdi-eye" @click:append="togglePasswordVisibility" required></v-text-field>
            <v-btn type="submit" block>Registrar</v-btn>
        </v-form>
    </v-card-text>
</v-card>
</template>

<script>
import {ref} from "vue";
import {auth} from "../services/firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";

export default {
    setup() {
        // const newName = ref("");
        // const newPhone = ref("");
        const newEmail = ref("");
        const newPassword = ref("");
        const passwordVisible = ref(false);

        // Função para registrar novo usuário
        const register = async () => {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    newEmail.value,
                    newPassword.value
                );
                alert("Usuário registrado com sucesso!");
                console.log("Usuário registrado:", userCredential.user);
            } catch (error) {
                alert(`Erro de registro: ${error.message}`);
            }
        };

        const togglePasswordVisibility = () => {
            passwordVisible.value = !passwordVisible.value;
        }

        return {
            newEmail,
            newPassword,
            passwordVisible,
            register,
            togglePasswordVisibility
        };
    },
}
</script>

<style>

</style>
