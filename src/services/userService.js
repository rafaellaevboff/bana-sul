import {doc, setDoc} from "firebase/firestore";
import {db} from '@/plugins/firebase';

export const newUser = async (uid, name, email) => {
    try {
        await setDoc(doc(db, "usuarios", crypto.randomUUID()), {
            login: uid,
            nome: name,
            email: email,
            perfil: 'agricultor',
            dataCadastro: new Date()
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};