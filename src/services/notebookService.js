import {doc, setDoc, collection, getDoc, getDocs, updateDoc} from "firebase/firestore";
import { db } from '@/plugins/firebase';

export const findNotebookById = async (id) => {
    const docRef = doc(db, "cadernos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Dados do documento:", docSnap.data());
    } else {
        console.log("Nenhum documento encontrado!");
    }
}

export const newNotebook = async (name, usuarioUid) => {
    try {
        await setDoc(doc(db, "cadernos", crypto.randomUUID()), {
            name: name,
            usuario: doc(db, 'usuarios', usuarioUid)
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
}

export const getNotebooks = async () => {
    const querySnapshot = await getDocs(collection(db, 'cadernos'));
    const listNotebooks = [];

    querySnapshot.forEach((doc) => {
        listNotebooks.push({id: doc.id, ...doc.data()});
    });

    return listNotebooks
};

export const deleteNotebook = async (idNotebook) => {
    await db.collection('notebook').doc(idNotebook).delete();
};

export const updateNotebook = async (idNotebook, nameNotebook) => {
    const docRef = doc(db, 'cadernos', idNotebook);
    await updateDoc(docRef, {
        nome: nameNotebook
    });
};

export const getNotebookById = async (idNotebook) => {
    const doc = await db.collection('cadernos').doc(idNotebook).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
};