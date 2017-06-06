import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import filter from 'lodash/filter';
import mongoose from 'mongoose';
import schedule from 'node-schedule';

import buildApiRequest from './buildApiRequest';
import Goal from './goal';

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

// Every day at 2AM
let rule = new schedule.RecurrenceRule();
rule.hour = 2;

schedule.scheduleJob(rule, () => {
    const { channelId } = config.fetch;
    // Fetching the 50 last playlist
    buildApiRequest('GET', '/youtube/v3/playlists', { channelId, maxResults: 50, part: 'snippet,contentDetails' })
        .then(response => {
            if (!response) return false;

            // Filter the playlist and getting only the goals playlist
            const goalsPlaylist = filter(response.items, playlist => /^Buts/i.test(playlist.snippet.title));

            if (goalsPlaylist) {
                goalsPlaylist.map(playlist => {
                    // Getting info from the playlist title:
                    // Buts 25ème journée (saison 2016/2017)
                    const { title } = playlist.snippet;
                    const day = parseInt(title.replace(/(.*Buts\s+)(.*)(ème.*)/, '$2'));
                    const season = title.replace(/(.*saison\s+)(.*)(\).*)/, '$2');

                    // Fetching the 50 last playlist items (videos)
                    // Do we need to fetch more ?
                    buildApiRequest('GET', '/youtube/v3/playlistItems', {
                        playlistId: playlist.id,
                        maxResults: 50,
                        part: 'snippet,contentDetails'
                    })
                        .then(response => {
                            if (!response) return false;

                            response.items.map(item => {
                                // Getting info from the video title:
                                // But Kylian MBAPPE (19') / AS Monaco - AS Saint-Etienne (2-0) - / 2016-17
                                const { resourceId, title } = item.snippet;
                                const url = `https://youtu.be/${resourceId.videoId}`;
                                const info = title.split('/');

                                const minute = info[0].match(/\d+/)[0];
                                const player = info[0].replace(/(.*But\s+)(.*)(\s+\(.*)/, '$2');
                                const score = info[1].replace(/(.*\()(.*)(\).*)/, '$2');

                                // Verifying if the goal isn't already in MongoDB
                                Goal.findOne({ day, minute, player, score, season }, (err, goal) => {
                                    if (err) return false;

                                    // If not, saving it
                                    if (!goal)
                                        new Goal({ day, minute, player, score, season, url }).save();
                                });
                            });
                        });
                })
            }
        });
});



