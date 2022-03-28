import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { stubValue } from './utils/login.util';
import User from '../database/models/User.model';
import { LoginService } from '../app/services/login.service';
import { LoginValidation } from '../app/validations/login.validation';
import { UserCredentials } from '../app/domain';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  before(async () => {
    sinon.stub(User, 'findOne').resolves(stubValue as User);
  });

  after(() => {
    (User.findOne as sinon.SinonStub).restore();
  });

  it('should return status 200', async () => {
    chai
      .request(app)
      .post('/login')
      .send({ email: 'email@email.com', password: 'secret_admin' })
      .end((err, res: Response) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('token');
      });
  });

  it('should return status 401 and message "All fields must be filled"', async () => {
    chai
      .request(app)
      .post('/login')
      .send({ password: 'secret_admin' })
      .end((_err, res: Response) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.be.equal('All fields must be filled');
      });

    chai
      .request(app)
      .post('/login')
      .send({ email: 'email@email.com' })
      .end((_err, res: Response) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.be.equal('All fields must be filled');
      });
  });

  it('should return status 401 and message "Incorrect email or password"', async () => {
    chai
      .request(app)
      .post('/login')
      .send({ email: 'wrong_email', password: 'secret_admin' })
      .end((_err, res: Response) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.be.equal('Incorrect email or password');
      });

    chai
      .request(app)
      .post('/login')
      .send({ email: 'email@email.com', password: 'wrong_admin' })
      .end((_err, res: Response) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.be.equal('Incorrect email or password');
      });
  });

  // LoginService.login
  describe('loginService', () => {
    const loginService = new LoginService();

    it('should return object with token', async () => {
      const response = await loginService.login({
        email: 'email@email.com',
        password: 'secret_admin',
      });

      expect(response).to.haveOwnProperty('token');
    });

    it('should return error message "Incorrect email or password"', async () => {
      try {
        await loginService.login({
          email: 'wrong_email',
          password: 'secret_admin',
        });
      } catch (error) {
        expect(error)
          .to.haveOwnProperty('message')
          .to.be.equal('Incorrect email or password');
      }

      try {
        await loginService.login({
          email: 'email@email.com',
          password: 'wrong_password',
        });
      } catch (error) {
        expect(error)
          .to.haveOwnProperty('message')
          .to.be.equal('Incorrect email or password');
      }
    });
  });

  // LoginValidation.validate
  describe('loginValidation', () => {
    const loginValidation = new LoginValidation();
    const credentials = {
      email: 'email@email.com',
      password: 'secret_admin',
    };

    it('should return validated object ', async () => {
      const response = await loginValidation.validate(credentials);

      expect(response).to.be.deep.equal(credentials);
    });

    it('should return error message "All fields must be filled"', async () => {
      try {
        await loginValidation.validate({
          email: 'email@email.com',
        } as UserCredentials);
      } catch (error) {
        expect(error)
          .to.haveOwnProperty('message')
          .to.be.equal('All fields must be filled');
      }

      try {
        await loginValidation.validate({
          password: 'secret_admin',
        } as UserCredentials);
      } catch (error) {
        expect(error)
          .to.haveOwnProperty('message')
          .to.be.equal('All fields must be filled');
      }
    });

    it('should return error message "Incorrect email or password"', async () => {
      try {
        await loginValidation.validate({
          email: 'wrong_email',
          password: 'password',
        });
      } catch (error) {
        expect(error)
          .to.haveOwnProperty('message')
          .to.be.equal('Incorrect email or password');
      }

      try {
        await loginValidation.validate({
          email: 'email@email.com',
          password: 'wp',
        });
      } catch (error) {
        expect(error)
          .to.haveOwnProperty('message')
          .to.be.equal('Incorrect email or password');
      }
    });
  });
});
