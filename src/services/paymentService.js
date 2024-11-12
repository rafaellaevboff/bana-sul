import {doc, setDoc} from "firebase/firestore";
import {db} from "@/plugins/firebase";

export const newPayment = async (notebook, real) => {
    try {
        await setDoc(doc(db, "pagamentos", crypto.randomUUID()), {
            caderno: notebook,
            real: real,
            dataCadastro: new Date()
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
}