import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/plugins/firebase";
import store from "@/store";
import { getNotebookByUser } from "@/services/notebookService";

export const logout = async (router, setError) => {
    try {
        await signOut(auth);
        localStorage.removeItem('farmerNotebook');
        await router.push('/');
    } catch (error) {
        setError(`Erro ao fazer logout: ${error.message}`);
    }
};

export const login = async (router, email, password, setError) => {
    const auth = getAuth();

    if (!email.value || !password.value) {
        setError("Email e senha são obrigatórios.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

        await store.dispatch('auth/verifyAuthentication');
        const userRole = store.getters['auth/isAdmin'];

        if (!userRole) {
            const notebookDoc = await getNotebookByUser(userCredential.user.uid, !userRole);
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
        if (error.code === "auth/invalid-credential") setError('Senha ou e-mail incorretos.');
        else setError(`Erro: ${error.message}`);
    }
};

