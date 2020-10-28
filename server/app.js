const express = require('express');
const app = express();

const errorHandlers = require('./handlers/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')());

//All routes
app.use('/user', require('./routes/user'));
app.use('/chatroom', require('./routes/chatroom'));

//Setup Error Handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if(process.env.ENV === 'DEVELOPMENT') {
    app.use(errorHandlers.developmentErrors);
} else {
    app.use(errorHandlers.productionErrors);
}

module.exports = app;
