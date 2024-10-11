import {collection, doc, getDocs, setDoc} from "firebase/firestore";

export const newBananaPrice = async (db, uid, dataInicio, dataFim, prataPrimeira, prataSegunda, caturraPrimeira, caturraSegunda) => {
    try {
        await setDoc(doc(db, "precosBanana", uid), {
            dataInicio: dataInicio,
            dataFim: dataFim,
            prataPrimeira: prataPrimeira,
            prataSegunda: prataSegunda,
            caturraPrimeira: caturraPrimeira,
            caturraSegunda: caturraSegunda
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};

export const getBananasPrice = async (db) => {
    const querySnapshot = await getDocs(collection(db, 'precosBanana'));
    const listPrices = [];

    querySnapshot.forEach((doc) => {
        listPrices.push({id: doc.id, ...doc.data()});
    });

    return listPrices
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