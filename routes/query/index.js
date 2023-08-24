const express = require('express');
const router = express.Router();
const ai = require('../../resources/AI');
const connection = require("../../config/connection.json");
const sql           = require('mssql');

//fazendo a conexão global
sql
  .connect(connection)
  .then((conn) => (global.conn = conn))
  .catch((err) => console.log(err));

router.post("/", async (req, res) => {
  const {
    cLogin,
    cChamada,
    textoChamada,
    pergunta
  } = req.body;  

  if(!cLogin || !cChamada || !pergunta || !textoChamada) {
    res.status(400).send("Preencha todos os campos!");
  }

  try {
    
    //O usuário está analisando a ligação para validar se houve um bom atendimento.

    const PROMPT = `
      Você responde perguntas sobre uma ligação de telemarketing, entre um Atendente e um Cliente.
      As falas do Atendente são antecedidas de "Atendente:", já a do cliente é antecedida de "Cliente:"
      Use a transcrição da chamada abaixo para responder a pergunta do usuário.
      Se a resposta não for encontrada nas transcrições, responda que não sabe, não tente inventar uma resposta.

      Mostre um curto trecho de no máximo 3 linhas do texto que foi utilizado para análise.

      Transcrição da Chamada:
      ${textoChamada}

      Pergunta:
      ${pergunta}
    `    

    const result = await ai.ask(PROMPT);

    insereMensagemChat(cLogin, cChamada, pergunta);

    // console.log(result);
    res.json(result);
    
  } catch (error) {
    res.status(500).send(error)
  }

})

async function insereMensagemChat(cLogin, cChamada, mensagem) {
  try {
    let result = await global.conn
      .request()
      .input("cLogin", sql.Int, cLogin)
      .input("cChamada", sql.Int, cChamada)
      .input("mensagem", sql.VarChar(8000), mensagem)
      .execute("s_Speech_Analysis_Insere_Mensagem_Chat");
  } catch (error) {
    console.log(error)
  }
}



module.exports = router;