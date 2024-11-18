import {collection, doc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from '@/plugins/firebase';

export const newNotebook = async (name, usuarioUid) => {
    try {
        await setDoc(doc(db, "cadernos", crypto.randomUUID()), {
            nome: name,
            usuario: usuarioUid,
            dataCadastro: new Date()
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
}

export const updateNotebook = async (notebook) => {
    const docRef = doc(db, 'cadernos', notebook.id);
    await updateDoc(docRef, {
        nome: notebook.nome
    });
};

export const getNotebookByUser = async (id) => {
    const cadernosRef = collection(db, 'cadernos');
    const q = query(cadernosRef, where("usuario", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {id: doc.id, ...doc.data()}
    } else {
        console.log("Nenhum caderno encontrado para o usuário.");
        return null;
    }
};

// export const saldoAgricultor = async (id) => {
//     let harvest = await getItemByNotebook('colheita', id)
//     let agriculturalInputs = await agriculturalInputsDiscountedInNotebook(id)
//     let payments = await getItemByNotebook('pagamentos', id)
// }