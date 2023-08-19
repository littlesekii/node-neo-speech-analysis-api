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
    pergunta,
    textoChamada
  } = req.body;  

  if(!pergunta || !textoChamada) {
    res.status(400).send("Preencha todos os campos!");
  }

  try {

    console.log(pergunta, textoChamada)
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

    console.log(result);
    res.json(result);
    
  } catch (error) {
    res.status(500).send(error)
  }

})

module.exports = router;