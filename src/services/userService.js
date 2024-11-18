import {doc, getDocs, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {db} from '@/plugins/firebase';
import {getAuth, updateEmail} from "firebase/auth";

export const newUser = async (uid, name, email) => {
    try {
        await setDoc(doc(db, "usuarios", crypto.randomUUID()), {
            login: uid,
            nome: name,
            email: email,
            perfil: 'agricultor',
            dataCadastro: new Date()
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};

export const updateUser = async (user) => {
    console.log("doc: ", user)
    const docRef = doc(db, 'usuarios', user.id);
    await updateDoc(docRef, {
        nome: user.nome,
        email: user.email
    });
};

export const getUsersAndEmailLogin = async (collection) => {
    const db = getFirestore();

    try {
        const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
        return usuariosSnapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
    }
}

export const updateUserEmail = async (uid, newEmail) => {
    const auth = getAuth();
    const db = getFirestore();

    try {
        const user = auth.currentUser;
        if (user && user.uid === uid) {
            await updateEmail(user, newEmail);
        }

        const userDocRef = doc(db, "usuarios", uid);
        await updateDoc(userDocRef, {email: newEmail});

        console.log("Email atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar o email:", error);
        throw error;
    }
};