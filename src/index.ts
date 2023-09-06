import express from 'express';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import path from 'path';
import logger from 'morgan';
import router from './routes/routes';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', router);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;