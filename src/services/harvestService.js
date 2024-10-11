import {doc, setDoc} from "firebase/firestore";

export const newHarvest = async (db, uid, cadernoSelecionado, quantidade, precoTotal) => {
    try {
        await setDoc(doc(db, "colheita", uid), {
            cadernoSelecionado: cadernoSelecionado,
            quantidade: quantidade,
            precoTotal: precoTotal
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};