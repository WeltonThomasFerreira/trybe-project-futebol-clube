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
      .send({ email: 'email@email.com', password: 'secret_password' })
      .end((err, res: Response) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
  });

  it('should return status 401', async () => {
    chai
      .request(app)
      .post('/login')
      .send({ email: 'wrong_email', password: 'wrong_password' })
      .end((err, res: Response) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
      });
  });
});
