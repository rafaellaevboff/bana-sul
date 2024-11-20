import {collection, doc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from '@/plugins/firebase';
import {agriculturalInputsDiscountedInNotebook} from "@/services/agriculturalInputsService";
import {getItemByNotebook} from "@/services/essentialFunctions";

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

export const getNotebookByUser = async (id, userRole) => {
    const cadernosRef = collection(db, 'cadernos');
    const q = query(cadernosRef, where("usuario", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {id: doc.id, ...doc.data()}
    } else if (userRole){
        return true
    } else {
        console.log("Nenhum caderno encontrado para o usuário.");
        return null;
    }
};

export const saldoAgricultor = async (id) => {
    let harvests = await getItemByNotebook('colheita', id)
    let agriculturalInputs = await agriculturalInputsDiscountedInNotebook(id)
    let payments = await getItemByNotebook('pagamentos', id)

    let harvestsTotal = harvests.reduce((sum, item) => sum + item.precoTotal, 0);
    let agriculturalInputsTotal = agriculturalInputs.reduce((sum, item) => sum + item.valorTotal, 0);
    let paymentsTotal = payments.reduce((sum, item) => sum + item.valor, 0);

    console.log("harvestsTotal: ", harvestsTotal)
    console.log("agriculturalInputsTotal: ", agriculturalInputsTotal)
    console.log("paymentsTotal: ", paymentsTotal)

    console.log("total: ", harvestsTotal - agriculturalInputsTotal - paymentsTotal)
    return harvestsTotal - agriculturalInputsTotal - paymentsTotal;
}