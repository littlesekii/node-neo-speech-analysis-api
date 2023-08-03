const express = require('express');
const app = express();
const port = 3333;

//routes
const mainRoute = require('./routes/main');
const queriesRoute = require('./routes/queries');
const consultasRoute = require('./routes/consultas');
const servicosRoute = require('./routes/servicos');

app.use(express.json()); 

app.use("/", mainRoute);
app.use("/query", queriesRoute);
app.use("/servicos", servicosRoute);
app.use("/consultas", consultasRoute);
          
// app.use(express.urlencoded());     

app.listen(port, () => {
  console.log("Server running on port: " + port);
})