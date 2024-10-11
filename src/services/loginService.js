import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "@/plugins/firebase";

export const logout = async (router) => {
    try {
        await signOut(auth);
        await router.push('/');
    } catch (error) {
        alert(`Erro ao fazer logout: ${error.message}`);
    }
}

export const login = async (router, email, password) => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
    );
    console.log("Usuário logado:", userCredential.user);
    await router.push("/app/home");
}

export const novoUser = async (auth, email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
}
