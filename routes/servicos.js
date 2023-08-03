const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.send('Servicos');
})

router.post("/palavrasOfensivas", async (req, res) => {
  const prompt = QUERY_PALAVRAS_OFENSIVAS + req.body.prompt;
  const aiResponse = await ai.ask(prompt);
  console.log(prompt);

  result = JSON.parse(aiResponse);

  console.log(result);
  res.json(result);
})


module.exports = router;