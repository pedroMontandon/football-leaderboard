import * as sinon from 'sinon';
import * as chai from 'chai';

import chaiHttp = require('chai-http');

import { App } from '../../app';

import SequelizeTeam from '../../database/models/SequelizeTeam';

chai.use(chaiHttp)

const { app } = new App();

const { expect } = chai;

describe('Testing teams route', function () {
  beforeEach(function () { sinon.restore()})
  it('should return all teams in "/teams"', async function () {
    const builtTeam = SequelizeTeam.build({ id: 1, teamName: 'Team 1' });
    sinon.stub(SequelizeTeam, 'findAll').resolves([builtTeam]);
    const res = await chai.request(app).get('/teams')
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq(builtTeam)
  })  
})