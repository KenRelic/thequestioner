const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const debug = require('debug')('app');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose')
const cors = require('cors');

// const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
// const validateUser = require('./validation');
const indexRoute = require('./src/routes/index');

const app = express();
const port = process.env.PORT || 5050;

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/', indexRoute);

app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

// Connect to DB using mongo Client 
// Connection URL
const uri = process.env.DB_URL;

// Database Name
mongoose.connect(`${uri}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection not successful. [error]"));
db.once("open", () => debug("connection to DB successful"));

// Use connect method to connect to the server
// async function main() {
//   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//   client.connect(err => {
//     if (err) return console.log(err)
//     debug(`DB ${chalk.green('connected')} successfully`);
//     // perform actions on the collection object
//     return client.close();
//   });
// }
// main().catch(console.error);

app.listen(port, () => debug(`Server ${chalk.magenta('running')} on port: ${chalk.green(port)}`));
