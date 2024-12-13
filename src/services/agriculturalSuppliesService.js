import {collection, doc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from '@/plugins/firebase';

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