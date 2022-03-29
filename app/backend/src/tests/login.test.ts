import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { stubValue, authorization, wrong_authorization } from './utils/login.util';
import User from '../database/models/User.model';

chai.use(chaiHttp);

const { expect } = chai;

describe('login', () => {
  before(async () => {
    sinon.stub(User, 'findOne').resolves(stubValue as User);
  });

  after(() => {
    (User.findOne as sinon.SinonStub).restore();
  });

  it('POST /login should return status 200', async () => {
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

  it('POST /login should return status 401 and message "All fields must be filled"', async () => {
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

  it('POST /login should return status 401 and message "Incorrect email or password"', async () => {
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

  it('GET /login/validate should return user role', async () => {
    chai
      .request(app)
      .get('/login/validate')
      .set("Authorization", authorization)
      .end((_err, res: Response) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.equal('admin');
      });
  });

  it('GET /login/validate should return status 500 and message "Invalid token"', async () => {
    chai
      .request(app)
      .get('/login/validate')
      .set("Authorization", wrong_authorization)
      .end((_err, res: Response) => {
        expect(res).to.have.status(500);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.be.equal('invalid token');
      });
  });
});
