import {collection, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import {db} from '@/plugins/firebase';
import {getItemById} from "@/services/essentialFunctions";

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

export const newPurchaseAgriculturalInput = async (agriculturalInput, notebook, quantity, total, descontadoCaderno, pago) => {
    try {
        await setDoc(doc(db, "compraInsumos", crypto.randomUUID()), {
            insumo: agriculturalInput,
            caderno: notebook,
            quantidade: quantity,
            valorTotal: total,
            descontadoCaderno: descontadoCaderno,
            pago: pago,
            dataCadastro: Date.now()
        });
        console.log('Nova compra cadastrada com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar os dados:", error.message);
    }
};


export const getPurchaseAgriculturalInputsByNotebook = async (notebookId) => {
    const idValue = notebookId.value || notebookId;
    const q = query(collection(db, 'compraInsumos'), where("caderno", "==", idValue));
    const querySnapshot = await getDocs(q);

    return await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const insumoData = await getItemById("insumos", data.insumo);

            return {
                id: docSnap.id,
                ...data,
                insumoNome: insumoData.name || 'Nome não encontrado'
            };
        })
    );
};

export const statusPurchaseInput = async (purchase) => {
    console.log("ENTROU AQ EM STATUS")
    console.log(purchase)
    if(purchase.descontadoCaderno) return "Descontado no caderno"
    else if(purchase.pago) return "Pago"
    else return "Pagamento pendente"
}