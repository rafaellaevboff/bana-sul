import {doc, getFirestore, setDoc} from "firebase/firestore";
const db = getFirestore();

export const newHarvest = async (uid, cadernoSelecionado, quantidade, precoTotal) => {
    try {
        await setDoc(doc(db, "colheita", uid), {
            cadernoSelecionado: cadernoSelecionado,
            quantidade: quantidade,
            precoTotal: precoTotal
        });
        console.log('Dados da colheita salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};