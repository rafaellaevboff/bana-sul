import {doc, getFirestore, setDoc} from "firebase/firestore";

const db = getFirestore();

export const getUserById = async (userId) => {
    const doc = await db.collection('usuarios').doc(userId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const newUser = async (db, uid, name, email) => {
    try {
        await setDoc(doc(db, "usuarios", uid), {
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

export const updateUser = async (user) => {
    await db.collection('usuarios').doc(user.id).update({
        nome: user.nome,
        email: user.email,
        perfil: user.perfil
    });
};

export const deleteUser = async (userId) => {
    await db.collection('usuarios').doc(userId).delete();
};