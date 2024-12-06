import {collection, doc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from '@/plugins/firebase';
import {getItemById} from "@/services/essentialFunctions";
import {format} from "date-fns";

export const newAgriculturalSupply = async (name, description, value) => {
    try {
        await setDoc(doc(db, "insumos", crypto.randomUUID()), {
            nome: name,
            descricao: description,
            valor: value,
            dataCadastro: new Date()
        });
        console.log('Novo insumo cadastrado com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar os dados:", error.message);
    }
};

export const getAgriculturalSupplies = async () => {
    const querySnapshot = await getDocs(collection(db, 'insumos'));
    const listPrices = [];

    querySnapshot.forEach((doc) => {
        listPrices.push({id: doc.id, ...doc.data()});
    });

    return listPrices
};

export const updateAgriculturalSupply = async (agriculturalSupply) => {
    const docRef = doc(db, 'insumos', agriculturalSupply.id);
    await updateDoc(docRef, {
        nome: agriculturalSupply.nome,
        descricao: agriculturalSupply.descricao,
        valor: agriculturalSupply.valor
    });
};


export const newPurchaseAgriculturalSupply = async (notebook, agriculturalSupply, purchaseDate, quantity, total, deductedNotebook, paid) => {
    try {
        await setDoc(doc(db, "compraInsumos", crypto.randomUUID()), {
            caderno: notebook,
            insumo: await getItemById("insumos", agriculturalSupply),
            dataEfetuacao: purchaseDate,
            quantidade: quantity,
            valorTotal: total,
            descontadoCaderno: deductedNotebook,
            pago: paid,
            dataCadastro: new Date()
        });
        console.log('Nova compra cadastrada com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar os dados:", error.message);
    }
};

export const updatePurchaseAgriculturalSupply = async (purchase) => {
    const docRef = doc(db, 'compraInsumos', purchase.id);
    await updateDoc(docRef, {
        descontadoCaderno: purchase.descontadoCaderno,
        pago: purchase.pago
    });
    console.log("item: ", purchase)
};
export const getPurchaseAgriculturalSuppliesByNotebook = async (notebookId) => {
    try {
        const q = query(collection(db, 'compraInsumos'), where("caderno", "==", notebookId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                status: statusPurchaseSupply(data),
                nomeInsumo: data.insumo?.nome,
                dataEfetuacao: format(data.dataEfetuacao, 'dd/MM/yyyy'),
                valorTotal: data.valorTotal
            };
        });
    } catch (error) {
        console.error("Erro ao buscar os dados:", error.message);
        return [];
    }
};

export const agriculturalSuppliesDiscountedInNotebook = async (notebookId) => {
    try {
        const q = query(collection(db, 'compraInsumos'), where("caderno", "==", notebookId));
        const querySnapshot = await getDocs(q);

        return await Promise.all(
            querySnapshot.docs
                .filter((docSnap) => docSnap.data().descontadoCaderno === true)
                .map(async (docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        ...data,
                    };
                })
        );
    } catch (error) {
        console.error("Erro ao buscar os dados:", error.message);
    }
};

const statusPurchaseSupply = (purchase) => {
    if(purchase.descontadoCaderno) return "Descontado no caderno"
    else if(purchase.pago) return "Pago"
    else return "Pagamento pendente"
}