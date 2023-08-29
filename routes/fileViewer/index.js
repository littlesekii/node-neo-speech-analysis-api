//carregando modulos
const fs            = require('fs');
const express       = require('express');
const path          = require('path');
const router        = express.Router();

//Acessa os arquivos da pasta de chat do neoo
router.get('/audios/:file', function(req, res) {
    const {file} = req.params
    
    const caminho = 'C:\\Users\\davi.bacalhau\\Documents\\GitHub\\Hacktoon_Velha_Guarda\\'

    res.sendFile(path.resolve(caminho, file));        
});

//exporta o router
module.exports = router;