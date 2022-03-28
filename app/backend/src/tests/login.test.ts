import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app, User } from './index';
import { userResolve } from './utils/login.util';

chai.use(chaiHttp);

const { expect } = chai;

describe('App', () => {
  before(async () => {
    sinon.stub(User, 'findOne').resolves(userResolve as User);
  });

  after(() => {
    (User.findOne as sinon.SinonStub).restore();
  });

  it('POST /login should return status 200', () => {
    chai
      .request(app)
      .post('/login')
      .send({ email: 'email@email.com', password: 'secret_password' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
  });

  it('POST /login should return status 401', () => {
    chai
      .request(app)
      .post('/login')
      .send({ email: 'wrong_email', password: 'wrong_password' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
      });
  });
});
