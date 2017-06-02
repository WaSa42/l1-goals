import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';

const config = require('config.json')('./config.json');
const app = express();

mongoose.connect(config.database);

app.listen(config.port);
app.use(
    bodyParser.json(),
    cors(),
    bodyParser.urlencoded({ extended: false }),
    logger('dev')
);

console.log('Server is running on port ' + config.port + '.');
