const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.send('Main');
})

router.get("/ping", (req, res) => {
  res.send('Pong');
})

module.exports = router;