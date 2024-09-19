import { doc, setDoc } from "firebase/firestore";

export const saveUserDataToFirestore = async (db, uid, name, email, phone) => {
  try {
    await setDoc(doc(db, "usuarios", uid), {
      name: name,
      email: email,
      phone: phone,
      type: 'agricultor'
    });
    console.log('Dados do usuário salvos com sucesso no Firestore');
  } catch (error) {
    console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
  }
};
