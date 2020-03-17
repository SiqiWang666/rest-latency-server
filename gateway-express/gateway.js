const express = require('express');
const request = require('request');

const app = new express();
const PORT = 5000;
const RESTSERVERPORT = 8080;
// Body parser reqest
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
        res.status(500).send('Rest Server Error');
    }
});
// @route  POST '/rest'
// @desc   Stage Two: issue n requests to restserver
app.post('/rest', async (req, res) => {
    // Extract parameter from request body
    const numRequests = req.body.numRequests;
    
    try {
        var totalTime = 0;
        const options = {
            url: `http://localhost:${RESTSERVERPORT}/request`,
            method: 'GET'
        };
        // Send request to rest server
        for(let i = 0; i < numRequests; i++) {
            try {
                console.log(`This is ${i}th request`);
                totalTime  += await JSON.parse(request(options).body).data;
                console.log(`Current time is ${totalTime}`);
                /*
                request(options, async (error, response, body) => {
                    if (error)
                        console.error(error);
                    // Check response status code
                    if (response.statusCode === 200) {
                        totalTime = totalTime + parseInt(JSON.parse(body).data);
                    }
                    ;
                    console.log(`Current time is ${totalTime}`);
                });
                */
            } catch(err) {
                res.status(500).send('Rest Server Error');
            }
        }
        // Response to client
        res.set({'Content-Type': 'text/html'});
        res.send(`I made ${numRequests} requests. It took ${totalTime} milliseconds.`);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Rest Server Error');
    }
});

app.listen(PORT, console.log(`Gateway is listening on port: ${PORT}`));

