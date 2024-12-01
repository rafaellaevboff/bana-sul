import {collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from '@/plugins/firebase';
import {agriculturalSuppliesDiscountedInNotebook} from "@/services/agriculturalSuppliesService";
import {getItemByNotebook} from "@/services/essentialFunctions";
import {format} from "date-fns";

export const newNotebook = async (name, usuarioUid) => {
    try {
        await setDoc(doc(db, "cadernos", crypto.randomUUID()), {
            nome: name,
            usuario: usuarioUid,
            dataCadastro: new Date()
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
}

export const updateNotebook = async (notebook) => {
    const docRef = doc(db, 'cadernos', notebook.id);
    await updateDoc(docRef, {
        nome: notebook.nome
    });
};

export const getNameNotebook = async (id) => {
    try {
        const docRef = doc(db, 'cadernos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, name: docSnap.data().nome };
        } else {
            console.log("Nenhum documento encontrado!");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar o item:", error);
        return null;
    }
};

export const getNotebookByUser = async (id, userRole) => {
    const cadernosRef = collection(db, 'cadernos');
    const q = query(cadernosRef, where("usuario", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {id: doc.id, ...doc.data()}
    } else if (userRole){
        return false
    } else {
        throw new Error('Houve um problema ao fazer login!')
    }
};

export const farmerBalance = async (id) => {
    const [harvests, agriculturalSupplies, payments] = await Promise.all([
        getItemByNotebook('colheita', id),
        agriculturalSuppliesDiscountedInNotebook(id),
        getItemByNotebook('pagamentos', id)
    ]);

    let harvestsTotal = harvests.reduce((sum, item) => sum + item.total, 0)
    let agriculturalSuppliesTotal = agriculturalSupplies.reduce((sum, item) => sum + item.valorTotal, 0)
    let paymentsTotal = payments.reduce((sum, item) => sum + item.valor, 0)

    return harvestsTotal - (agriculturalSuppliesTotal + paymentsTotal);
}

export const getNotebookItems = async (id) => {
    const [harvests, agriculturalSupplies, payments] = await Promise.all([
        getItemByNotebook('colheita', id),
        agriculturalSuppliesDiscountedInNotebook(id),
        getItemByNotebook('pagamentos', id)
    ]);

    let harvestsMapped = harvests.map(harvest => {
        let total = ['prataPrimeira', 'caturraPrimeira', 'prataSegunda', 'caturraSegunda']
            .reduce((sum, key) => sum + (harvest.precosBanana[key] * (harvest.quantidade.find(q => q.key === key)?.value || 0)), 0);

        return {
            tipo: 'harvest',
            valor: total,
            dataEfetuacao: format(harvest.dataEfetuacao, 'dd/MM/yyyy'),
            precosBanana: harvest.precosBanana,
            quantidade: harvest.quantidade
        };
    });

    let agriculturalSuppliesMapped = agriculturalSupplies.map(supply => ({
        tipo: 'agriculturalInput',
        valor: supply.valorTotal,
        dataEfetuacao: format(supply.dataEfetuacao, 'dd/MM/yyyy')
    }));

    let paymentsMapped = payments.map(payment => ({
        tipo: 'payment',
        valor: payment.valor,
        dataEfetuacao: format(payment.dataEfetuacao, 'dd/MM/yyyy')
    }));

    return [...harvestsMapped, ...agriculturalSuppliesMapped, ...paymentsMapped];
};
