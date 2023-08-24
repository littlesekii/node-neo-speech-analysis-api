const express = require('express');
const cors = require('cors');
const app = express();
const port = 3333;

//routes
const mainRoute = require('./routes/main');
const operadoresRoute = require('./routes/operadores');
const chamadasRoute = require('./routes/chamadas');

const analisarRoute = require('./routes/analisar');
const queryRoute = require('./routes/query');

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({limit: '50mb'}));

app.use(cors({ origin: '*' }));

app.use("/", mainRoute);

app.use("/operadores", operadoresRoute)
app.use("/chamadas", chamadasRoute)

app.use("/analisar", analisarRoute)
app.use("/query", queryRoute);
          
// app.use(express.urlencoded());     

app.listen(port, () => {
  console.log("Server running on port: " + port);
})
