import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import { db } from '@/plugins/firebase';

export const newAgriculturalInput = async (uid, name, description, value) => {
    try {
        await setDoc(doc(db, "insumos", uid), {
            name: name,
            descricao: description,
            valor: value
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

export const newPurchaseAgriculturalInput = async (uid, name, notebook, quantity) => {
    try {
        await setDoc(doc(db, "compraInsumos", uid), {
            name: name,
            notebook: notebook,
            quantity: quantity
        });
        console.log('Nova compra cadastrada com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar os dados:", error.message);
    }
};


export const getAgriculturalInputsByNotebook = async (notebookId) => {
    const querySnapshot = await getDocs(collection(db, 'insumos'));
    const listPrices = [];

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.notebookId === notebookId) {
            listPrices.push({ id: doc.id, ...data });
        }
    });

    return listPrices;
}