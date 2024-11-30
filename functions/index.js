const { getAuth } = require("firebase-admin/auth");
const functions = require('@google-cloud/functions-framework');
const cors = require("cors")({ origin: true });
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-credentials');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

functions.http('createUser', async (req, res) => {
  cors(req, res, async () => {
    if (req.method === "POST") {
      const { name, email, password } = req.body;
      if (!email || !password || !name) {
        return res.status(400).send("Nome, email e senha são necessários.");
      }
      try {
        const userRecord = await getAuth().createUser({
          email: email,
          password: password,
          displayName: name,
        });
        res.status(200).send(userRecord.uid);
      } catch (error) {
        console.error("Erro ao criar usuário:", error);
        
        if (error.code === "auth/email-already-exists") {
          res.status(400).send("O email fornecido já está em uso.");
        } else {
          res.status(500).send("Erro ao criar usuário: " + error.message);
        }

      }
    } else {
      res.status(405).send("Método não permitido");
    }
  });
});