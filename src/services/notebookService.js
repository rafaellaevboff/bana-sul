import {collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from '@/plugins/firebase';
import {agriculturalInputsDiscountedInNotebook} from "@/services/agriculturalInputsService";
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

export const saldoAgricultor = async (id) => {
    let harvests = await getItemByNotebook('colheita', id)
    let agriculturalInputs = await agriculturalInputsDiscountedInNotebook(id)
    let payments = await getItemByNotebook('pagamentos', id)

    let harvestsTotal = harvests.reduce((sum, item) => sum + item.total, 0)
    let agriculturalInputsTotal = agriculturalInputs.reduce((sum, item) => sum + item.valorTotal, 0)
    let paymentsTotal = payments.reduce((sum, item) => sum + item.valor, 0)

    return harvestsTotal - (agriculturalInputsTotal + paymentsTotal);
}

export const getNotebookItems = async (id) => {
    let harvests = await getItemByNotebook('colheita', id);
    let agriculturalInputs = await agriculturalInputsDiscountedInNotebook(id);
    let payments = await getItemByNotebook('pagamentos', id);

    let harvestsMapped = harvests.map(harvest => {
        let totalPrataPrimeira = harvest.precosBanana.prataPrimeira *
            (harvest.quantidade.find(q => q.key === 'prataPrimeira')?.value || 0)

        let totalCaturraPrimeira = harvest.precosBanana.caturraPrimeira *
            (harvest.quantidade.find(q => q.key === 'caturraPrimeira')?.value || 0)

        let totalPrataSegunda = harvest.precosBanana.prataSegunda *
            (harvest.quantidade.find(q => q.key === 'prataSegunda')?.value || 0)

        let totalCaturraSegunda = harvest.precosBanana.caturraSegunda *
            (harvest.quantidade.find(q => q.key === 'caturraSegunda')?.value || 0)

        let total = totalPrataPrimeira + totalCaturraPrimeira + totalPrataSegunda + totalCaturraSegunda;

        return {
            tipo: 'harvest',
            valor: total,
            dataEfetuacao: format(harvest.dataEfetuacao, 'dd/MM/yyyy'),
            precosBanana: harvest.precosBanana,
            quantidade: harvest.quantidade
        };
    });

    let agriculturalInputsMapped = agriculturalInputs.map(input => ({
        tipo: 'agriculturalInput',
        valor: input.valorTotal,
        dataEfetuacao: format(input.dataEfetuacao, 'dd/MM/yyyy')
    }));

    let paymentsMapped = payments.map(payment => ({
        tipo: 'payment',
        valor: payment.valor,
        dataEfetuacao: format(payment.dataEfetuacao, 'dd/MM/yyyy')
    }));

    return [...harvestsMapped, ...agriculturalInputsMapped, ...paymentsMapped];
};
