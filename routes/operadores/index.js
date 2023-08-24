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

  const { pesquisa } = req.query;

  // if(!pesquisa) {
  //   res.status(400).send("Preencha todos os campos!");
  //   return
  // }

  const operadores = await retornaOperadores(pesquisa);

  res.json(operadores)
})

async function retornaOperadores(pesquisa) {
  let retorno;

  try {
    let result = await global.conn
      .request()
      .input("pesquisa", sql.VarChar(8000), pesquisa ? pesquisa : "")
      .execute("s_Speech_Analysis_Retorna_Operadores");
      
      if (result?.recordsets) {
        retorno = result.recordset
      }

  } catch (error) {
    console.log(error)
  }

  return retorno;
}

module.exports = router;
