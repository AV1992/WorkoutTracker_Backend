// our dependencies
const express = require('express');
const app = express();

const userRouter = require('./routes/user');
const exerciseRoute = require('./routes/exercise');

const bodyParser = require("body-parser");

const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// from top level path e.g. localhost:3000, this response will be sent
app.get('/', (request, response) => response.send('Hello World'));

app.use('/user', userRouter);
app.use('/exercise', exerciseRoute);

// set the server to listen on port 3000
app.listen(3000, () => console.log('Listening on port 3000'));