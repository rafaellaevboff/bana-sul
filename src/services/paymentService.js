import {doc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "@/plugins/firebase";

export const newPayment = async (notebook, money, paymentDate) => {
    console.log()
    try {
        await setDoc(doc(db, "pagamentos", crypto.randomUUID()), {
            caderno: notebook,
            valor: money,
            dataEfetuacao: paymentDate,
            dataCadastro: new Date()
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
}

export const updatePayment = async (payment) => {
    try{
        const docRef = doc(db, 'pagamentos', payment.id);
        await updateDoc(docRef, {
            valor: payment.valor
        });
    } catch (error){
        console.error("Erro ao editar dados do usuário no Firestore:", error.message);
    }
}