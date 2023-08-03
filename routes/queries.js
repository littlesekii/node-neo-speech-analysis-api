const express = require('express');
const router = express.Router();
const ai = require('../resources/AI');

const QUERY_SENTIMENTOS = "Retorne um JSON, utilizando essa estrutura {atendente: [emocao, ...], cliente: [emocao, ...]}, com somente as 5 principais emoções do atendente e do cliente no texto a seguir: ";

const QUERY_COMPORTAMENTO = "Avaliando a conversa a seguir, entre um Atendente e Cliente, diga, resumidamente, se o atendente se comportou positivamente em comparação ao cliente. "

const QUERY_PROBLEMA_RESOLVIDO = "Avaliando a conversa a seguir, entre um Atendente e Cliente, diga, resumidamente, se o cliente teve o seu problema resolvido. "

const QUERY_SATISFACAO = "Avaliando a conversa a seguir, entre um Atendente e Cliente, diga , resumidamente, se o cliente ficou satisfeito com o atendimento. "

const QUERY_PALAVRAS_CHAVES = "Retorne um JSON, utilizando essa estrutura {palavras: []}, com somente 5 palavas-chaves sobre os problemas mencionados no texto a seguir: "

const QUERY_PROBLEMAS_CHAVES = "Retorne um JSON, utilizando essa estrutura {problemas: []}, com somente 5 frases sobre os problemas mencionados no texto a seguir: "

const QUERY_PALAVRAS_OFENSIVAS = "Regras: Trazer vazio se não encontrar; Retornar apenas se tiver 95% de certeza de que é uma palavra feia; Retorne um JSON, utilizando essa estrutura {atendente: [], cliente: []}, com as piores palavras feias ditas pelo Atendente e Cliente que literalmente estão nos textos a seguir: "

router.get("/", (req, res) => {
  res.send('Query');
})

router.get("/ask", async (req, res) => {
  const prompt = req.query.prompt;

  const result = await ai.ask(prompt);

  console.log(result);
  res.json(result);
  
})

router.post("/sentimentos", async (req, res) => {
  const prompt = QUERY_SENTIMENTOS + req.body.prompt;
  const aiResponse = await ai.ask(prompt);
  console.log(prompt);

  result = JSON.parse(aiResponse);

  console.log(result);
  res.json(result);
})

router.post("/comportamento", async (req, res) => {
  const prompt = QUERY_COMPORTAMENTO + req.body.prompt;
  const aiResponse = await ai.ask(prompt);
  console.log(prompt);

  result = aiResponse;

  console.log(result);
  res.json(result);
})

router.post("/problemaResolvido", async (req, res) => {
  const prompt = QUERY_PROBLEMA_RESOLVIDO + req.body.prompt;
  const aiResponse = await ai.ask(prompt);
  console.log(prompt);

  result = aiResponse;

  console.log(result);
  res.json(result);
})

router.post("/satisfacao", async (req, res) => {
  const prompt = QUERY_SATISFACAO + req.body.prompt;
  const aiResponse = await ai.ask(prompt);
  console.log(prompt);

  result = aiResponse;

  console.log(result);
  res.json(result);
})

router.post("/palavrasChaves", async (req, res) => {
  const prompt = QUERY_PALAVRAS_CHAVES + req.body.prompt;
  const aiResponse = await ai.ask(prompt);
  console.log(prompt);

  result = JSON.parse(aiResponse);

  console.log(result);
  res.json(result);
})

router.post("/problemasChaves", async (req, res) => {
  const prompt = QUERY_PROBLEMAS_CHAVES + req.body.prompt;
  const aiResponse = await ai.ask(prompt);
  console.log(prompt);

  result = JSON.parse(aiResponse);

  console.log(result);
  res.json(result);
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