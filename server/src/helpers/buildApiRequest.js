import fetch from 'node-fetch';

const config = require('config.json')('./config.json');
const { apiKey } = config.google;
const { baseUrl } = config.fetch;

export default (method, endpoint, body) => {
    body.key = apiKey;

    console.log(JSON.stringify(body));
    console.log(`${method.toUpperCase()} request from ${endpoint}...`);

    return fetch(baseUrl + serialize(method, endpoint, body), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method.toUpperCase() !== 'GET' ? JSON.stringify(body) : ''
    })
        .then(response => response.json())
        .then(response => {
            response.error ? console.error('FAILED:', response.error.message) : console.log('SUCCEED !') ;
            return response;
        })
        .catch(error => console.error(`FAILED: ${error.message}`));
}

function serialize(method, endpoint, body) {
    if (method.toUpperCase() !== 'GET')
        return endpoint;

    let str = '';
    for (const param in body) {
        if (str !== '') str += '&';
        str += `${param}=${encodeURIComponent(body[param])}`;
    }

    return`${endpoint}?${str}`;
}
