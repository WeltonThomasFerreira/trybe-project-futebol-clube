import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { stubValue, clubs } from './utils/clubs.util';
import Club from '../database/models/Club.model';

chai.use(chaiHttp);

const { expect } = chai;

describe('clubs', () => {
  before(async () => {
    sinon.stub(Club, 'findAll').resolves(stubValue as []);
  });

  after(() => {
    (Club.findAll as sinon.SinonStub).restore();
  });

  it('GET /clubs should return status 200', async () => {
    chai
      .request(app)
      .get('/clubs')
      .end((err, res: Response) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').to.deep.include.members(clubs);
      });
  });
});
