const express = require('express');
const fs = require('fs');
const app = express();


app.use((req, res, next) => {
    // write your logging code here
    const { method, httpVersion, url, statusCode } = req
    const time = new Date().toISOString()
    const agent = req.headers['user-agent'].replace(/,/g, ' ')


    const logs = '\n' + agent + "," + time + "," + req.method + "," + req.url + "," + "HTTP/" + req.httpVersion + "," + res.statusCode
    console.log(logs);
    fs.appendFile('log.csv', logs, (err) => {
        if (err) throw err;
    })

    next()
});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.status(200).send('ok!')

});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here

    // Agent, Time, Method, Resource, Version, Status
    let fileSync = fs.readFileSync('./log.csv').toString().split('\n').map(e => {
        e = e.replace(',', ' ')
        e = e.split(',')


        return {
            "Agent": e[0],
            "Time": e[1],
            "Method": e[2],
            "Resource": e[3],
            "Version": e[4],
            "Status": e[5],
        }
    });
    fileSync.shift()
    fileSync.shift()

    res.send(JSON.stringify(fileSync))

});

module.exports = app;