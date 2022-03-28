import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { stubValue } from './utils/login.util';
import User from '../database/models/User.model';

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
        console.log(res.body);

        expect(res).to.have.status(401);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.be.equal('Incorrect email or password');
      });
  });
});
