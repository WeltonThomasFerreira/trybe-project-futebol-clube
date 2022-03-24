import * as express from 'express';
import bodyParser = require('body-parser');
import loginRoute from './api/routes/login.route';
import errorHandler from './api/middlewares/errorhandler.middleware';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errors();
    this.config();
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
  }

  public middlewares(): void {
    this.app.use(bodyParser.json());
  }

  public routes(): void {
    this.app.use('/login', loginRoute);
  }

  public errors(): void {
    this.app.use(errorHandler);
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
