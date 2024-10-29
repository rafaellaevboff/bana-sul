import {doc, getDoc, setDoc} from "firebase/firestore";
import { db } from '@/plugins/firebase';

export const newUser = async (uid, name, email) => {
    try {
        await setDoc(doc(db, "usuarios", crypto.randomUUID()), {
            login: uid,
            name: name,
            email: email,
            perfil: 'agricultor',
            deleted: false
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};

export const getUserById = async (id) => {
    const docRef = doc(db, "usuarios", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        console.log("Nenhum documento encontrado!");
    }
};

export const updateUser = async (user) => {
    await db.collection('usuarios').doc(user.id).update({
        name: user.name,
        email: user.email,
        perfil: user.perfil
    });
};

export const deleteUser = async (userId) => {
    await db.collection('usuarios').doc(userId).delete();
};