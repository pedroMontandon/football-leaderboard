import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import SequelizeTeam from '../database/models/SequelizeTeam';
import SequelizeUser from '../database/models/SequelizeUser';

chai.use(chaiHttp);

const { expect } = chai;

describe('Seu teste', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  it('Seu sub-teste', () => {
    expect(false).to.be.eq(true);
  });
});

describe('Testing teams route', function () {
  beforeEach(function () { sinon.restore()})
  it('should return all teams in "/teams"', async function () {
    const builtTeam = SequelizeTeam.build({ id: 1, teamName: 'Team 1' });
    sinon.stub(SequelizeTeam, 'findAll').resolves([builtTeam]);
    const res = await chai.request(app).get('/teams')
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq(builtTeam)
  })
  it('should return a team by id in "/teams/:id"', async function () {
    const builtTeam = SequelizeTeam.build({ id: 1, teamName: 'Team 1' });
    sinon.stub(SequelizeTeam, 'findOne').resolves(builtTeam);
    const res = await chai.request(app).get('/teams/1')
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq(builtTeam)
  })
})

describe('Testing user route', function () {
  beforeEach(function () { sinon.restore()})
  it('should return 400 if you do not have an email in body in "/login"', async function () {
    const res = await chai.request(app).post('/login').send({password: '123456'});
    expect(res).to.have.status(400)
    expect(res).to.be.deep.eq({ message: 'All fields must be filled' });
  })
  it('should return 400 if you do not have an email in body in "/login"', async function () {
    const res = await chai.request(app).post('/login').send({email: 'chapolin@amarelo.com'});
    expect(res).to.have.status(400)
    expect(res).to.be.deep.eq({ message: 'All fields must be filled' });
  })
  it('should return 401 if the email is in an invalid format in "/login"', async function () {
    const res = await chai.request(app).post('/login').send({email: 'invalid', password: '123456'});
    expect(res).to.have.status(401)
    expect(res).to.be.deep.eq({ message: 'Invalid email or password' });
  })
  it('should return 401 if the password length is less than 6 in "/login"', async function () {
    const res = await chai.request(app).post('/login').send({email: 'valid@email.com', password: '12345'});
    expect(res).to.have.status(401)
    expect(res).to.be.deep.eq({ message: 'Invalid email or password' });
  })
  it('should return 401 if the password is invalid in "/login"', async function () {
    const builtInvalidUser = SequelizeUser.build({ id: 1, email: 'valid@email.com', password: 'invalid', role: 'user', username: 'valid' });
    sinon.stub(SequelizeUser, 'findOne').resolves(builtInvalidUser);
    const res = await chai.request(app).post('/login').send({email: 'valid@email.com', password: '1234567'});
    expect(res).to.have.status(401)
    expect(res).to.be.deep.eq({ message: 'Invalid email or password' });
  })
  it('should return 401 if the email is invalid in "/login"', async function () {
    const builtInvalidUser = SequelizeUser.build({ id: 1, email: 'invalid@email.com', password: '1234567', role: 'user', username: 'valid' });
    sinon.stub(SequelizeUser, 'findOne').resolves(builtInvalidUser);
    const res = await chai.request(app).post('/login').send({email: 'valid@email.com', password: '1234567'});
    expect(res).to.have.status(401)
    expect(res).to.be.deep.eq({ message: 'Invalid email or password' });
  })
  it('should return 200 if it is a happy case in "/login"', async function () {
    const builtUser = SequelizeUser.build({ id: 1, email: 'valid@email.com', password: '1234567', role: 'user', username: 'valid' });
    sinon.stub(SequelizeUser, 'findOne').resolves(builtUser);
    sinon.stub(bcrypt, 'compareSync').returns(true);
    const res = await chai.request(app).post('/login').send({email: 'valid@email.com', password: '1234567'})
    expect(res).to.have.status(200)
    expect(res.body).to.haveOwnProperty('token');
  })
  it('should return 401 if no token is provided', async function() {
    const res = await chai.request(app).get('/login/role');
    expect(res.status).to.be.equal(401);
    expect(res.body).to.be.deep.equal({ message: 'Token not found' });
  })
  it('should return 401 if token is invalid', async function() {
    const res = await chai.request(app).get('/login/role').set('Authorization', 'hey!');
    expect(res.status).to.be.equal(401);
    expect(res.body).to.be.deep.equal({ message: 'Token must be a valid token' });
  })
  // it() falta o happy case. Como mockar a instância da classe?
})
