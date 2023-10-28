const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const jwt = require("jsonwebtoken");


const contactsRouter = require('./routes/api/contacts');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})


const payload = { id: 123456, username: "Larson" };
const secret = "secret word";
let token = jwt.sign(payload, secret);

console.log("El Token");
console.log(token);

const decode = jwt.decode(token);

console.log("Decodificado");
console.log(decode);

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2LCJ1c2VybmFtZSI6IkxhcnNvbiIsImlhdCI6MTY5ODQ5NTYxMX0.GbW0t34KBgoLJLUXz2xChPpa5qDH4_31-I4Hucf7CPE";

const verify = jwt.verify(token, secret);
console.log("la verificación");
console.log(verify);

module.exports = app
