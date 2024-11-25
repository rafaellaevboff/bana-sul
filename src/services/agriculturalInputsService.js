import {collection, doc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from '@/plugins/firebase';
import {getItemById} from "@/services/essentialFunctions";
import {format} from "date-fns";
import {formatCurrency} from "@/services/formatService";

export const newAgriculturalInput = async (name, description, value) => {
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

export const getAgriculturalInputs = async () => {
    const querySnapshot = await getDocs(collection(db, 'insumos'));
    const listPrices = [];

    querySnapshot.forEach((doc) => {
        listPrices.push({id: doc.id, ...doc.data()});
    });

    return listPrices
};

export const updateAgriculturalInput = async (agriculturalInput) => {
    const docRef = doc(db, 'insumos', agriculturalInput.id);
    await updateDoc(docRef, {
        nome: agriculturalInput.nome,
        descricao: agriculturalInput.descricao,
        valor: parseFloat(agriculturalInput.valor)
    });
};

export const newPurchaseAgriculturalInput = async (notebook, agriculturalInput, purchaseDate, quantity, total, descontadoCaderno, pago) => {
    try {
        await setDoc(doc(db, "compraInsumos", crypto.randomUUID()), {
            caderno: notebook,
            insumo: await getItemById("insumos", agriculturalInput),
            dataEfetuacao: purchaseDate,
            quantidade: quantity,
            valorTotal: total,
            descontadoCaderno: descontadoCaderno,
            pago: pago,
            dataCadastro: new Date()
        });
        console.log('Nova compra cadastrada com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar os dados:", error.message);
    }
};

export const getPurchaseAgriculturalInputsByNotebook = async (notebookId) => {
    try {
        const q = query(collection(db, 'compraInsumos'), where("caderno", "==", notebookId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                status: statusPurchaseInput(data),
                nomeInsumo: data.insumo?.nome,
                dataEfetuacao: format(data.dataEfetuacao, 'dd/MM/yyyy'),
                valorTotal: formatCurrency(data.valorTotal)
            };
        });
    } catch (error) {
        console.error("Erro ao buscar os dados:", error.message);
        return [];
    }
};

export const agriculturalInputsDiscountedInNotebook = async (notebookId) => {
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

const statusPurchaseInput = (purchase) => {
    if(purchase.descontadoCaderno) return "Descontado no caderno"
    else if(purchase.pago) return "Pago"
    else return "Pagamento pendente"
}