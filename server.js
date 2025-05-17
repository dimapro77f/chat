const http = require('http');
const path = require('path');
const fs = require('fs');
const db = require("./database");
const { Server } = require("socket.io");


const pathToIndex = path.join(__dirname, 'static', 'index.html');
const indexHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'index.html'));
const styleCssFile = fs.readFileSync(path.join(__dirname, 'static', 'style.css'));
const scriptJsFile = fs.readFileSync(path.join(__dirname, 'static', 'script.js'));
const authFile = fs.readFileSync(path.join(__dirname, 'static', 'auth.js'));
const registerFile = fs.readFileSync(path.join(__dirname, 'static', 'register.html'));
const server = http.createServer((req, res) => {
    if (req.method == 'GET') {
        switch(req.url) {
        case '/': return res.end(indexHtmlFile);
        case '/style.css': return res.end(styleCssFile);
        case '/script.js': return res.end(scriptJsFile);
        case '/auth.js': return res.end(authFile);
        case '/register': return res.end(registerFile);
      }
  }
    if(req.method == 'POST') {
        switch(req.url) {
            case '/api/register': return registerUser(req, res);
        }
    }
    res.statusCode = 404;
    return res.end('Error 404')
});

function registerUser(req, res) {
    
}

server.listen(3000);

const io = new Server(server);
io.on('connection', async(socket) => {
console.log('Someone connect to my server. User id - '  + socket.id);
    let messages = await db.getMessage();
    socket.emit('all_messages', messages);

    socket.on('new_message', (message) => {
        db.addMessage(message, 1);
        console.log("db.addMessage(message, 1);");
    io.emit('message', message); 
    });
});