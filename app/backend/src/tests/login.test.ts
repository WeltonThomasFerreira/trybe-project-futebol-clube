import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app, User } from './index';

chai.use(chaiHttp);

const { expect } = chai;

describe('/login route behavior', () => {
  const resolve = {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
  };

  before(async () => {
    sinon.stub(User, 'findOne').resolves(resolve as User);
  });

  after(() => {
    (User.findOne as sinon.SinonStub).restore();
  });

  it('data is posted correctly', () => {
    const send = {
      email: 'admin@admin.com',
      password: 'secret_admin',
    };

    const response = {
      user: {
        id: 1,
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
      },
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjQ4MjYwNzI1fQ.hezg9yhal5uQlp98mp5-gXtPMG5_JHRgEJucjupJQWs',
    };

    chai
      .request(app)
      .post('/login')
      .send(send)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.deep.include(response);
      });
  });

  describe.skip('data is posted with empty fields', () => {
    it('without email', () => {
      const send = { password: 'secret_admin' };

      const response = { code: 401, message: 'All fields must be filled' };

      chai
        .request(app)
        .post('/login')
        .send(send)
        .end((_err, res) => {
          expect(res).to.have.status(response.code);
          expect(res.body).to.have.property('message').equal(response.message);
        });
    });
    it('without password', () => {
      const send = { email: 'admin@admin.com' };

      const response = { code: 401, message: 'All fields must be filled' };

      chai
        .request(app)
        .post('/login')
        .send(send)
        .end((_err, res) => {
          expect(res).to.have.status(response.code);
          expect(res.body).to.have.property('message').equal(response.message);
        });
    });
  });

  describe('data is posted incorrectly', () => {
    it('wrong email', () => {
      const send = { email: 'user@user.com', password: 'secret_admin' };

      const response = { code: 401, message: 'Incorrect email or password' };

      chai
        .request(app)
        .post('/login')
        .send(send)
        .end((_err, res) => {
          expect(res).to.have.status(response.code);
          expect(res.body).to.have.property('message').equal(response.message);
        });
    });
    it('wrong password', () => {
      const send = { email: 'admin@admin.com', password: 'no_secret_admin' };

      const response = { code: 401, message: 'Incorrect email or password' };

      chai
        .request(app)
        .post('/login')
        .send(send)
        .end((_err, res) => {
          expect(res).to.have.status(response.code);
          expect(res.body).to.have.property('message').equal(response.message);
        });
    });
  });
});
