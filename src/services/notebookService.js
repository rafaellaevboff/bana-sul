import {doc, setDoc, collection, getDocs} from "firebase/firestore";

export const newNotebook = async (db, name, usuarioUid) => {
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

export const getNotebooks = async (db) => {
    const querySnapshot = await getDocs(collection(db, 'cadernos'));
    const listNotebooks = [];

    querySnapshot.forEach((doc) => {
        listNotebooks.push({id: doc.id, ...doc.data()});
    });

    return listNotebooks
};
