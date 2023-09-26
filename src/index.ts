import express from 'express';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import path from 'path';
import logger from 'morgan';
import router from './routes/routes';
import session from 'express-session';

const app: express.Application = express();

app.use(session({
  secret: 'mylittlesecret',
  saveUninitialized: true,
  resave: true,
  cookie: {
    expires: new Date(Date.now() + 3600000),
    maxAge: 3600000
  }
}));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', router);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

app.use(errorHandler);

export default app;