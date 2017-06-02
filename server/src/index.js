// Modules
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

// Helpers
import buildApiRequest from './helpers/buildApiRequest';

const config = require('config.json')('./config.json');
const app = express();

mongoose.connect(config.database);

app.listen(config.port);
app.use(
    bodyParser.json(),
    cors(),
    bodyParser.urlencoded({ extended: false })
);

console.log('Server is running on port ' + config.port + '.');

const { channelId } = config.fetch;
buildApiRequest('GET', '/youtube/v3/playlists', { channelId, part: 'snippet,contentDetails' })
    .then(response => {
        if (!response) return false;


    });
