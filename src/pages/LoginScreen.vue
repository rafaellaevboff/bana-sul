<template>
<div>
    <v-container class="d-flex justify-center align-center fill-height">
        <v-row>
            <v-col cols="12" md="6" lg="4">
                <v-card class="pa-6">
                    <v-card-title class="text-h5">Bem vindo(a)!</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="login">
                            <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
                            <v-text-field v-model="password" label="Senha" :type="passwordVisible ? 'text' : 'password'" append-icon="mdi-eye" @click:append="togglePasswordVisibility" required></v-text-field>
                            <v-btn type="submit" block>Entrar</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</div>
</template>

<script>
import {
    ref
} from 'vue';
import {
    auth
} from '../services/firebase';
import {
    signInWithEmailAndPassword
} from "firebase/auth";
import {
    useRouter
} from 'vue-router';

export default {
    setup() {
        const email = ref("");
        const password = ref("");
        const router = useRouter();
        const passwordVisible = ref(false);

        const login = async () => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
                alert('Login bem-sucedido!');
                console.log('Usuário logado:', userCredential.user);
                router.push('/cadastro');
            } catch (error) {
                alert(`Erro de login: ${error.message}`);
            }
        };

        const togglePasswordVisibility = () => {
            passwordVisible.value = !passwordVisible.value;
        }

        return {
            email,
            password,
            passwordVisible,
            login,
            togglePasswordVisibility
        };
    }
};
</script>

<style scoped>
input {
    display: block;
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    max-width: 300px;
}

button {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #218838;
}
</style>
