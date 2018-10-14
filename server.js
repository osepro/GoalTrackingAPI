const http = require('http');
const app=require('./app');

const port = process.env.PORT || 3111;
const server=http.createServer(app);
server.listen(port,() =>{
    console.log('Sever successfully started on PORT 3111');
});