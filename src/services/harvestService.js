import {doc, getFirestore, setDoc, updateDoc} from "firebase/firestore";

const db = getFirestore();

export const newHarvest = async (notebook, quantity, unitPrices, total, harvestDate) => {
    try {
        await setDoc(doc(db, "colheita", crypto.randomUUID()), {
            caderno: notebook,
            quantidade: quantity,
            precosBanana: unitPrices,
            total: total,
            dataEfetuacao: harvestDate,
            dataCadastro: new Date()
        });
        console.log('Dados da colheita salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};

export const calculatedPricesHarvest = async (quantities, totalPriceBananas) => {
    const calculations = {};
    quantities.value.forEach(quantity => {
        const total = totalPriceBananas.value[quantity.key] || 0;
        calculations[quantity.key] = total > 0 ? total : null;
    });
    return calculations;
}

export const calculateTotalHarvest = async (quantities, unitPrices) => {
    let total = 0;
    console.log("unitPrices: ", unitPrices)

    quantities.value.forEach((quantity) => {
        const quantityValue = parseFloat(quantity.value) || 0;
        const price = unitPrices.value[quantity.key];
        total += quantityValue * price || 0;
    });

    return total;
}

export const updateHarvest = async (harvest) => {
    console.log("harvest: ", harvest)
    const docRef = doc(db, 'colheita', harvest.id);
    await updateDoc(docRef, {
        quantidade: harvest.quantidade,
        total: calculateTotalHarvest(harvest.quantidade, harvest.precosBanana)
    });
}