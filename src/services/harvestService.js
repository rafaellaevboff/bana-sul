import {doc, getFirestore, setDoc, updateDoc} from "firebase/firestore";

const db = getFirestore();

export const newHarvest = async (notebook, quantity, unitPrices, total, harvestDate) => {
    try {
        quantity.forEach(qtd => {
            qtd.value = qtd.value ? parseInt(qtd.value) : 0;
        });
        await setDoc(doc(db, "colheita", crypto.randomUUID()), {
            caderno: notebook,
            quantidade: quantity,
            precosBanana: unitPrices,
            total: total.toFixed(2),
            dataEfetuacao: harvestDate,
            dataCadastro: new Date()
        });
        console.log('Dados da colheita salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};

export const calculatedPricesHarvest = (quantities, totalPriceBananas) => {
    return quantities.value.map(quantity => {
        const total = totalPriceBananas.value[quantity.key] || 0;
        return {
            key: quantity.label,
            total: total > 0 ? total : null,
        };
    });
};

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