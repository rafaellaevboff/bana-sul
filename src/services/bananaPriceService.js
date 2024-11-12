import {doc, setDoc} from "firebase/firestore";
import {db} from '@/plugins/firebase';

export const newBananaPrice = async (dataInicio, dataFim, prataPrimeira, prataSegunda, caturraPrimeira, caturraSegunda) => {
    try {
        await setDoc(doc(db, "precosBanana", crypto.randomUUID()), {
            dataInicio: dataInicio,
            dataFim: dataFim,
            prataPrimeira: prataPrimeira,
            prataSegunda: prataSegunda,
            caturraPrimeira: caturraPrimeira,
            caturraSegunda: caturraSegunda,
            dataCadastro: new Date()
        });
        console.log('Preços de bananas salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};

export const getpricesDate = async (pricesDate) => {
    return pricesDate.find(item => {
        const startDate = new Date(item.dataInicio);
        const endDate = new Date(item.dataFim);
        return Date.now() >= startDate && Date.now() <= endDate;
    });
};

export const dataAtualpricesCadastrados = async (pricesDate) => {
    return pricesDate.some(item => {
        const startDate = new Date(item.dataInicio);
        const endDate = new Date(item.dataFim);
        return Date.now() >= startDate && Date.now() <= endDate;
    });
};