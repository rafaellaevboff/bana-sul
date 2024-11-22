import {doc, setDoc, updateDoc} from "firebase/firestore";
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
        const startDate = item.dataInicio;
        const endDate = item.dataFim;
        const date = new Date();
        const today = date.toISOString().split('T')[0];

        return today >= startDate && today <= endDate;
    });
};

export const currentDateRegisteredPrices = async (pricesDate) => {
    return pricesDate.some(item => {
        const startDate = item.dataInicio;
        const endDate = item.dataFim;
        const date = new Date();
        const today = date.toISOString().split('T')[0];

        return today >= startDate && today <= endDate;
    });
};

export const getpricesDateHarvest = async (pricesDate, harvestDate) => {
    return pricesDate.find(item => {
        const startDate = item.dataInicio;
        const endDate = item.dataFim;

        return harvestDate >= startDate && harvestDate <= endDate;
    });
};

export const dateRegisteredPricesHarvest = async (pricesDate, harvestDate) => {
    return pricesDate.some(item => {
        const startDate = item.dataInicio;
        const endDate = item.dataFim;

        return harvestDate >= startDate && harvestDate <= endDate;
    });
};

export const updatePrice = async (price) => {
    const docRef = doc(db, 'precosBanana', price.id);
    await updateDoc(docRef, {
        prataPrimeira: price.prataPrimeira,
        prataSegunda: price.prataSegunda,
        caturraPrimeira: price.caturraPrimeira,
        caturraSegunda: price.caturraSegunda,
    });
}