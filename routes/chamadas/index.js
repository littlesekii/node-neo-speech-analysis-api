const express = require('express');
const router = express.Router();
const connection = require("../../config/connection.json");
const sql = require('mssql');

//fazendo a conexão global
sql
  .connect(connection)
  .then((conn) => (global.conn = conn))
  .catch((err) => console.log(err));

router.get("/", async (req, res) => {

  const { cOperador } = req.query;

  if(!cOperador) {
    res.status(400).send("Preencha todos os campos!");
    return
  }

  const chamadas = await retornaChamadasOperador(cOperador);

  if(!chamadas){
    res.status(500).send("Erro ao retornar as chamadas do operador!");
    return
  }

  res.json(chamadas)  
})

async function retornaChamadasOperador(cOperador) {  

  try {
    let result = await global.conn
      .request()
      .input("cOperador", sql.Int, cOperador)
      .execute("s_Speech_Analysis_Retorna_Chamadas_Operador");
      
      if (result.recordset) {
        return result.recordset
      } else {
        return null
      }

  } catch (error) {
    return null
    console.log(error)
  }  
}

router.get("/:id", async (req, res) => {

  const { id } = req.params
  const { loginUsuario } = req.query

  if(!id) {
    res.status(400).send("Preencha todos os campos!");
    return
  }

  try {      

    let result = await retornaChamada(loginUsuario, id);

    let detalhesChamada = result[0][0];
    let analisesChamada = result[1]; 
    let textoChamada = result[2][0].textoChamada;

    analisesChamada = analisesChamada.map(item => {
      item.value = (item.tipoRetorno == "JSON") ? JSON.parse(item.value) : item.value
      return item
    })

    detalhesChamada.textoChamada = textoChamada
    detalhesChamada.perguntasPadroes = analisesChamada.filter(item => item.indice != 1)
    detalhesChamada.humorAtendente = analisesChamada[0].value.atendente
    detalhesChamada.humorCliente = analisesChamada[0].value.cliente


    res.json(detalhesChamada)

  } catch (error) {
    res.status(500).send(error)
  }

})

async function retornaChamada(loginUsuario, cChamada) {

  let retorno = [];

  try {
    let result = await global.conn
      .request()
      .input("loginUsuario", sql.VarChar(100), loginUsuario ? loginUsuario : 0)
      .input("cChamada", sql.Int, cChamada ? cChamada : 0)
      .execute("s_Speech_Analysis_Retorna_Chamada");
      
      retorno = result.recordsets

  } catch (error) {
    console.log(error)
  }

  return retorno;
}

/* {
    audioUrl: 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3',
    textoAudio: '',
    humorAtendente: [
      {
        codigo: 1,
        emoji: '😀',
        humor: 'alegre',
      },
      {
        codigo: 2,
        emoji: '😥',
        humor: 'Triste',
      },
      {
        codigo: 3,
        emoji: '😥',
        humor: 'Triste',
      },
      {
        codigo: 4,
        emoji: '😥',
        humor: 'Triste',
      },
      {
        codigo: 5,
        emoji: '😥',
        humor: 'Triste',
      },
    ],
    humorCliente: [
      {
        codigo: 1,
        emoji: '😀',
        humor: 'alegre',
      },
      {
        codigo: 2,
        emoji: '😥',
        humor: 'Triste',
      },
      {
        codigo: 3,
        emoji: '😥',
        humor: 'Triste',
      },
      {
        codigo: 4,
        emoji: '😥',
        humor: 'Triste',
      },
      {
        codigo: 5,
        emoji: '😥',
        humor: 'Triste',
      },
    ],        
    perguntasPadroes: [
      {
        codigo: 1,
        label: 'O cliente ameaçou acionar os orgãos de defesa do consumidor?',
        formatoResposta: 'Retornar a resposta como true ou false',
        tipoExibicao: 'boolean',
        resposta: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, cum inventore. Temporibus, aut asperiores corporis iusto distinctio eveniet quis nihil ut qui quia.'
      },
      {
        codigo: 2,
        label: 'O cliente abriu manifesto em sistema relacionado a ameaça em contato, quando mencionado?',
        formatoResposta: 'Retornar a resposta como true ou false',
        tipoExibicao: 'boolean',
        resposta: true
      },
      {
        codigo: 3,
        label: 'O cliente mencionou intenção de cancelamento?',
        formatoResposta: 'Retornar a resposta como true ou false',
        tipoExibicao: 'boolean',
        resposta: false
      },
      {
        codigo: 4,
        label: 'Há evidência de cancelamento do serviço/produto relacionado a intenção de cancelamento, quando mencionado?',
        formatoResposta: 'Retornar a resposta como true ou false',
        tipoExibicao: 'boolean',
        resposta: true
      },
      {
        codigo: 5,
        label: 'O cliente é reincidente no motivo relacionado a ligação avaliada?',
        formatoResposta: 'Retornar a resposta como true ou false',
        tipoExibicao: 'boolean',
        resposta: false
      },
      {
        codigo: 6,
        label: 'O operador realiza a call back em situações de queda de ligação?',
        formatoResposta: 'Retornar a resposta como true ou false',
        tipoExibicao: 'boolean',
        resposta: true
      },     
      {
        codigo: 7,
        label: 'O problema do cliente foi solucionado?',
        formatoResposta: 'Retornar a resposta em um texto de 5 linhas',
        tipoExibicao: 'texto',
        resposta: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, cum inventore. Temporibus, aut asperiores corporis iusto distinctio eveniet quis nihil ut qui quia.'
      },  
      {
        codigo: 8,
        label: 'O problema do cliente foi solucionado?',
        formatoResposta: 'Retornar a resposta em um texto de 5 linhas',
        tipoExibicao: 'texto',
        resposta: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, cum inventore. Temporibus, aut asperiores corporis iusto distinctio eveniet quis nihil ut qui quia.'
      },  
      {
        codigo: 9,
        label: 'O problema do cliente foi solucionado?',
        formatoResposta: 'Retornar a resposta em um texto de 5 linhas',
        tipoExibicao: 'texto',
        resposta: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, cum inventore. Temporibus, aut asperiores corporis iusto distinctio eveniet quis nihil ut qui quia.'
      },  
    ]                          
  }
*/

module.exports = router;
