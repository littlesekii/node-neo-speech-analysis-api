const express = require('express');
const router = express.Router();
const connection = require("../../config/connection.json");
const sql = require('mssql');
const ai = require('../../resources/AI');

//fazendo a conexão global
sql
  .connect(connection)
  .then((conn) => (global.conn = conn))
  .catch((err) => console.log(err));

router.post("/", async (req, res) => {

  console.log('rodou')

  const { cChamada } = req.body;

  if(!cChamada) {
    console.log('preenchaa')
    res.status(400).send("Preencha todos os campos!");
    return
  }

  const parametrosAnaliseChamada = await retornaParametrosAnaliseChamada(cChamada);

  console.log(parametrosAnaliseChamada)

  // console.log(parametrosAnaliseChamada)
  if (parametrosAnaliseChamada) {

    res.status(200).send("Chamada analisada com sucesso!") 
    
    try {
      const falas = parametrosAnaliseChamada[0];
      const perguntas = parametrosAnaliseChamada[1];
      const humores = parametrosAnaliseChamada[2][0].humores;
      console.log(humores)

      let textoChamada = '';

      for(let i = 0; i < falas.length; i++) {
        textoChamada += falas[i].fala + ' ';
      }

      let PROMPT = `Realize esta operação da forma mais precisa possível. Retorne um objeto JSON com respostas para as perguntas abaixo sobre o texto da chamada. (As falas do Atendente são antecedidas de "Atendente:", e a do cliente é antecedida de "Cliente:") `;

      for (let i = 0; i < perguntas.length; i++) {
        const pergunta = perguntas[i].pergunta;
        const formatoResposta = perguntas[i].formatoResposta;
        PROMPT += `Na ${i + 1}ª chave do JSON de nome "${i}", retorne, no formato de ${formatoResposta}, ${pergunta} `;
      }

      PROMPT += `Na antepenúltima chave do JSON de nome "humorAtendente", selecione, apenas da lista de sentimentos a seguir ${humores} qual se encaixa ao comportamento do Atendente.`;
      PROMPT += `Na penultima chave do JSON de nome "humorCliente", selecione, apenas da lista de sentimentos a seguir ${humores} qual se encaixa ao comportamento do Cliente.`;
      PROMPT += `Na ultima chave do JSON de nome "problemaResolvido", retorne, em formato de Boolean, se o Cliente teve seu problema resolvido.`;

      PROMPT += `Texto da Chamada: ${textoChamada}`

      const result = await ai.ask(PROMPT);
      const json = JSON.parse(result);

      const humorAtendente = json[`humorAtendente`];
      const humorcliente = json[`humorCliente`];
      const problemaResolvido = json[`problemaResolvido`];

      await insereAnaliseChamada(cChamada, humorAtendente, humorcliente, problemaResolvido)

      for (let i = 0; i < perguntas.length; i++) {
        const codigoPergunta = perguntas[i].codigo;
        const formatoResposta = perguntas[i].formatoResposta;   

        let resposta = json[`${i}`];

        switch (formatoResposta) {
          case 'JSON':
            resposta = JSON.stringify(resposta);
            break;
          case 'Boolean':
            resposta = String(resposta);
            break;
          default:
            break;
        }
        
        await insereRespostaAnaliseChamada(cChamada, codigoPergunta, resposta)
      }
    } catch (e) {
      console.log(e)
      return
      // res.status(400).send("Erro ao analisar chamada!") 
    }
 
  } else
    res.status(400).send("Erro ao analisar chamada!")  
})

async function retornaParametrosAnaliseChamada(cChamada) {

  let retorno = false;

  try {
    let result = await global.conn
      .request()
      .input("cChamada", sql.Int, cChamada)
      .execute("s_Speech_Analysis_Retorna_Parametros_Analise_Chamada");
      
      if (result.recordsets) {
        retorno = result.recordsets
      }

  } catch (error) {
    console.log(error)
  }

  return retorno;
}

async function insereAnaliseChamada(cChamada, humorOperador, humorCliente, problemaResolvido) {
  try {
    let result = await global.conn
      .request()
      .input("cChamada", sql.Int, cChamada)
      .input("humorOperador", sql.VarChar(50), humorOperador)
      .input("humorCliente", sql.VarChar(50), humorCliente)
      .input("resolvida", sql.Bit, problemaResolvido)
      .execute("s_Speech_Analysis_Insere_Analise");

  } catch (error) {
    console.log(error)
  }
}

async function insereRespostaAnaliseChamada(cChamada, cPergunta, resposta) {
  try {
    let result = await global.conn
      .request()
      .input("cChamada", sql.Int, cChamada)
      .input("cPergunta", sql.Int, cPergunta)
      .input("resposta", sql.Text, resposta)
      .execute("s_Speech_Analysis_Insere_Resposta");

  } catch (error) {
    console.log(error)
  }
}
module.exports = router;
