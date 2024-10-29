import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "@/plugins/firebase";
import store from "@/store";
import {getNotebookByUser} from "@/services/notebookService";

export const logout = async (router) => {
    try {
        await signOut(auth);
        localStorage.removeItem('farmerNotebook')
        await router.push('/');
    } catch (error) {
        alert(`Erro ao fazer logout: ${error.message}`);
    }
}

export const login = async (router, email, password) => {
    const auth = getAuth();

    if (!email.value || !password.value) {
        console.error("Email e senha são obrigatórios.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

        await store.dispatch('auth/checkAuthStatus');
        const userRole = store.getters['auth/isAdmin'];

        if (!userRole) {
            const notebookDoc = await getNotebookByUser(userCredential.user.uid);

            if (notebookDoc) {
                const notebookId = notebookDoc.id;
                localStorage.setItem('farmerNotebook', notebookId);
                await router.push({ name: 'Caderno', params: { id: notebookId } });
            } else {
                await router.push('/');
            }
        } else {
            await router.push('/app/home');
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
    }
};


export const newUserLogin = async (auth, email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
}
