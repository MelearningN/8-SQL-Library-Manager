const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes/index');
const books = require('./routes/books');
const search = require('./routes/search');
const errorHandlers = require('./errorHandlers');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);
app.use('/search', search)

// catch 404 and forward to error handler
app.use(errorHandlers.handleFourOhFour);
app.use(errorHandlers.handleGlobalError);


module.exports = app;
