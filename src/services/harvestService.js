import {doc, getFirestore, setDoc} from "firebase/firestore";
const db = getFirestore();

export const newHarvest = async (notebook, quantity, unitPrices, total) => {
    try {
        await setDoc(doc(db, "colheita", crypto.randomUUID()), {
            caderno: notebook,
            quantidade: quantity,
            precosBanana: unitPrices,
            total: total,
            dataCadastro: new Date()
        });
        console.log('Dados da colheita salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};