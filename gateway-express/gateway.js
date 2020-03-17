const express = require('express');
const request = require('request');

const app = new express();
const PORT = 5000;
const RESTSERVERPORT = 8080;
// Body parser request
app.use(express.json({ extended: false}));

// @route GET '/rest'
// @desc  Stage One: issue single request to restserver
app.get('/rest', (req, res) => {
    try {
        const options = {
            url: `http://localhost:${RESTSERVERPORT}/request`,
            method: 'GET'
        };
        request(options, (error, response, body) => {
            if(error) console.error(error);
            const info = JSON.parse(body);
            res.set({'Content-Type': 'text/html'});
            if(response.statusCode !== 200) {
                res.status(500).send(`${info.message}`);
            }else {
                res.send(`I RESTed for ${info.data} time units.`)
            }
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route  POST '/rest'
// @desc   Stage Two: issue n requests to restserver
app.post('/rest', async (req, res) => {
    // Extract parameter from request body
    const numRequests = req.body.numRequests;
    let responseTime = [];
    let requests = [];
    // Declare a promise function
    function issueSingleRequest(responseTime) {
        const options = {
            url: `http://localhost:${RESTSERVERPORT}/request`,
            method: 'GET'
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if(error) reject('error');
                else {
                    responseTime.push(JSON.parse(body).data);
                    resolve();
                }
            });
        });
    };
    for(let i = 0; i < numRequests; i++) {
        requests.push(issueSingleRequest(responseTime));
    };
    // Issue n requests in parallell
    Promise.all(requests).then(() => {
        let totalTime = responseTime.reduce((a, b)=> {return a + b;}, 0);
        // Test
        //console.log(responseTime);
        res.set({'Content-Type': 'text/html'});
        res.send(`I made ${numRequests} requests and it took ${totalTime} milliseconds`);
    }).catch((error) => res.status(500).send('Server Error'))
    
});

app.listen(PORT, console.log(`Gateway is listening on port: ${PORT}`));

