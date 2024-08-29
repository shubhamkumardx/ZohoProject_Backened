const express = require("express");
const PORT = 5000;
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config()
const ConnectDb = require("./Db/Config");
const router = require('./routers/index')
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/',router )


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
