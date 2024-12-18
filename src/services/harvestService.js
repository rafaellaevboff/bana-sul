import {doc, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {getItemById} from "@/services/essentialFunctions";

const db = getFirestore();

export const newHarvest = async (notebook, quantity, unitPrices, total, harvestDate) => {
    try {
        await quantity.forEach(qtd => {
            qtd.value = qtd.value ? parseInt(qtd.value) : 0;
        });
        console.log("quantity: ", quantity)
        await setDoc(doc(db, "colheita", crypto.randomUUID()), {
            caderno: notebook,
            quantidade: quantity,
            precosBanana: unitPrices,
            total: parseFloat(total.toFixed(2)),
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

    quantities.forEach( quantity => {
        const quantityValue = parseFloat(quantity.value) || 0;
        const price = unitPrices[quantity.key];
        total += quantityValue * price || 0;
    });

    return parseFloat(total).toFixed(2);
}

export const updateHarvest = async (harvest) => {
    const docRef = doc(db, 'colheita', harvest.id);
    const harvestBefore = await getItemById('colheita', harvest.id)

    harvestBefore.quantidade.forEach( item => {
        item.value = parseInt(harvest[item.key])
    })

    const totalHarvest = await calculateTotalHarvest(harvestBefore.quantidade, harvestBefore.precosBanana)

    await updateDoc(docRef, {
        quantidade: harvestBefore.quantidade,
        total: totalHarvest
    });
}