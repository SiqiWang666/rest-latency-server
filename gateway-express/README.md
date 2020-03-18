# Intro
This is a REST gateway written in javascript with Node.js and Express.
## Stage One
For each incoming request, it issues a HTTP request to the RestServ and return HTML document.
```
GET /rest
```
## Stage Two
For each incoming request, it issues n HTTP requests to the RestServ and return content in accept type.
```
POST /rest
```
# Quick Start
0. Set up environment. [Download Node.js](https://nodejs.org/en/download/package-manager/#macos)
1. Run `npm install` to install the dependencies, `express` (web framework for Node.js) and `request` (module to make http request).
2. Start RestServer, checkout the binary file and execute the one that is suitable for you OS.
3. Start RestGateway, either `npm start` (under gateway-express folder) or `npm --prefix gateway-express start` (under main folder).
4. Send requests using `curl`.

## Sample Request Commands

- `curl -X GET localhost:5000/rest`
- `curl -d '{"numRequests": 5}' -H "Content-Type: application/json" -X POST localhost:5000/rest`
- `curl -d '{"numRequests": 5}' -H "Content-Type: application/json" -H "Accept:application/json" -X POST localhost:5000/rest`
