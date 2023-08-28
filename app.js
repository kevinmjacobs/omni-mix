import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';

import ROUTER from './routes/index.js';

const APP = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

APP.set('views', path.join(__dirname, 'views'));
APP.set('view engine', 'ejs');

APP.use(logger("dev"));
APP.use(express.json());
APP.use(express.urlencoded({extended: true}));
APP.use(cookieParser());
APP.use(express.static(path.join(__dirname, 'public')));

APP.use('/', ROUTER);

APP.use((req, res, next) => {
  next(createError(404));
});

APP.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default APP;