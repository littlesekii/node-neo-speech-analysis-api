const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.send('Consultas');
})

router.post("/sentimentos", async (req, res) => {
  const prompt = QUERY_SENTIMENTOS + req.body.prompt;
  const aiResponse = await ai.ask(prompt);
  console.log(prompt);

  result = JSON.parse(aiResponse);

  console.log(result);
  res.json(result);
})

module.exports = router;