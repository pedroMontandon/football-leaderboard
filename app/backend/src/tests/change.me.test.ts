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
import SequelizeMatch from '../database/models/SequelizeMatch';
import JwtUtils from '../utils/JwtUtils';

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
});

describe('Testing teams route', function () {
  beforeEach(function () { sinon.restore()})
  it('should return all teams in "/teams"', async function () {
    const builtTeam = SequelizeTeam.build({ id: 1, teamName: 'Team 1' });
    sinon.stub(SequelizeTeam, 'findAll').resolves([builtTeam]);
    const res = await chai.request(app).get('/teams')
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([builtTeam.dataValues])
  })
  it('should return a team by id in "/teams/:id"', async function () {
    const builtTeam = SequelizeTeam.build({ id: 1, teamName: 'Team 1' });
    sinon.stub(SequelizeTeam, 'findOne').resolves(builtTeam);
    const res = await chai.request(app).get('/teams/1')
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq(builtTeam.dataValues)
  })
})

describe('Testing user route', function () {
  beforeEach(function () { sinon.restore()})
  it('should return 400 if you do not have an email in body in "/login"', async function () {
    const res = await chai.request(app).post('/login').send({password: '123456'});
    expect(res).to.have.status(400)
    expect(res.body).to.be.deep.eq({ message: 'All fields must be filled' });
  })
  it('should return 400 if you do not have an email in body in "/login"', async function () {
    const res = await chai.request(app).post('/login').send({email: 'chapolin@amarelo.com'});
    expect(res).to.have.status(400)
    expect(res.body).to.be.deep.eq({ message: 'All fields must be filled' });
  })
  it('should return 401 if the email is in an invalid format in "/login"', async function () {
    const res = await chai.request(app).post('/login').send({email: 'invalid', password: '123456'});
    expect(res).to.have.status(401)
    expect(res.body).to.be.deep.eq({ message: 'Invalid email or password' });
  })
  it('should return 401 if the password length is less than 6 in "/login"', async function () {
    const res = await chai.request(app).post('/login').send({email: 'valid@email.com', password: '12345'});
    expect(res).to.have.status(401)
    expect(res.body).to.be.deep.eq({ message: 'Invalid email or password' });
  })
  it('should return 401 if the password is invalid in "/login"', async function () {
    const builtInvalidUser = SequelizeUser.build({ id: 1, email: 'valid@email.com', password: 'invalid', role: 'user', username: 'valid' });
    sinon.stub(SequelizeUser, 'findOne').resolves(builtInvalidUser);
    const res = await chai.request(app).post('/login').send({email: 'valid@email.com', password: '1234567'});
    expect(res).to.have.status(401)
    expect(res.body).to.be.deep.eq({ message: 'Invalid email or password' });
  })
  it('should return 401 if the email is invalid in "/login"', async function () {
    const builtInvalidUser = SequelizeUser.build({ id: 1, email: 'invalid@email.com', password: '1234567', role: 'user', username: 'valid' });
    sinon.stub(SequelizeUser, 'findOne').resolves(builtInvalidUser);
    const res = await chai.request(app).post('/login').send({email: 'valid@email.com', password: '1234567'});
    expect(res).to.have.status(401)
    expect(res.body).to.be.deep.eq({ message: 'Invalid email or password' });
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
  it('should return a role in "/login/role"', async function() {
    const builtUser = SequelizeUser.build({ id: 1, email: 'valid@email.com', password: '1234567', role: 'user', username: 'valid' });
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, email: 'valid@email.com' });
    sinon.stub(SequelizeUser, 'findOne').resolves(builtUser);
    const res = await chai.request(app).get('/login/role').set('Authorization', 'valid-token');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.deep.eq({ role: 'user' });
  })
})

describe ('Testing matches route', function () {
  beforeEach(function () { sinon.restore()})
  it('should return all matches in progress in "/matches?inProgress=true"', async function () {
    sinon.stub(SequelizeMatch, 'findAll').resolves([]);
    const res = await chai.request(app).get('/matches?inProgress=true');
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([])
  })
  it('should return all matches finished matches in "/matches?inProgress=false"', async function () {
    const builtTeam = SequelizeMatch.build({ id: 1, homeTeamGoals: 1, awayTeamGoals: 2, homeTeamId: 1, awayTeamId: 2, inProgress: false });
    sinon.stub(SequelizeMatch, 'findAll').resolves([builtTeam]);
    const res = await chai.request(app).get('/matches?inProgress=false');
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([builtTeam.dataValues])
  })
  it('should return all matches finished matches in "/matches"', async function () {
    const builtTeam = SequelizeMatch.build({ id: 1, homeTeamGoals: 1, awayTeamGoals: 2, homeTeamId: 1, awayTeamId: 2, inProgress: false });
    sinon.stub(SequelizeMatch, 'findAll').resolves([builtTeam]);
    const res = await chai.request(app).get('/matches');
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([builtTeam.dataValues])
  })
  it('should return "Finished" in "/matches/:id/finish"', async function () {
    sinon.stub(SequelizeMatch, 'update').resolves();
    sinon.stub(JwtUtils.prototype, 'verify').resolves({ id: 1, email: 'valid@email.com' });
    const res = (await chai.request(app).patch('/matches/1/finish').set('authorization', 'token'));
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq({ message: 'Finished' })
  })
  it('should return "match not found in" "/matches/:id"', async function () {
    sinon.stub(SequelizeMatch, 'findByPk').resolves(null);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, email: 'valid@email.com' });
    const res = await chai.request(app).patch('/matches/1').set('authorization', 'token');
    expect(res).to.have.status(404)
    expect(res.body).to.be.deep.eq({ message: 'There is no team with such id!' })
  })
  it('should return "It is not possible to create a match with two equal teams" in "/matches"', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, email: 'valid@email.com' });
    const res = await chai.request(app).post('/matches').set('authorization', 'token').send({ homeTeamId: 1, awayTeamId: 1 });
    expect(res).to.have.status(422)
    expect(res.body).to.be.deep.eq({ message: 'It is not possible to create a match with two equal teams' })
  })
  it('should return "There is no team with such id!" in "/matches"', async function () {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(null);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, email: 'valid@email.com' });
    const res = await chai.request(app).post('/matches').set('authorization', 'token').send({ homeTeamId: 1, awayTeamId: 2 });
    expect(res).to.have.status(404);
    expect(res.body).to.be.deep.eq({ message: 'There is no team with such id!' });
  })
  it('should return "created" in "post./matches"', async function () {
    const builtMatch = SequelizeMatch.build({ id: 1, homeTeamGoals: 1, awayTeamGoals: 2, homeTeamId: 1, awayTeamId: 2, inProgress: false });
    const builtTeam = SequelizeTeam.build({ id: 1, teamName: 'Team 1' });
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, email: 'valid@email.com' });
    sinon.stub(SequelizeTeam, 'findByPk').resolves(builtTeam);
    sinon.stub(SequelizeMatch, 'create').resolves(builtMatch);
    const res = await chai.request(app).post('/matches').set('authorization', 'token').send({ homeTeamId: 1, awayTeamId: 2 });
    expect(res).to.have.status(201);
    expect(res.body).to.be.deep.eq(builtMatch.dataValues);
  })
})

describe ('Testing leaderboard route', function () {
  beforeEach(function () { sinon.restore()})
  it('should return a leaderboard in "/leaderboard"', async function () {
    const builtTeam = SequelizeMatch.build({ id: 1, homeTeamGoals: 1, awayTeamGoals: 2,
       homeTeamId: 1, awayTeamId: 2, inProgress: false });
    sinon.stub(SequelizeMatch, 'findAll').resolves([builtTeam]);
    const res = await chai.request(app).get('/leaderboard')
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([{ totalGames: 2, totalVictories: 1, totalDraws: 0, totalLosses: 1, totalPoints: 3, goalsFavor: 3, goalsOwn: 3, goalsBalance: 0, efficiency: '50.00' }])
  })
  it('should return just home games leaderboard in "/leaderboard/home"', async function () {
    const builtTeam = SequelizeMatch.build({ id: 1, homeTeamGoals: 1, awayTeamGoals: 1,
       homeTeamId: 1, awayTeamId: 2, inProgress: false });
    sinon.stub(SequelizeMatch, 'findAll').resolves([builtTeam]);
    const res = await chai.request(app).get('/leaderboard/home')
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([{ totalGames: 1, totalVictories: 0, totalDraws: 1, totalLosses: 0, totalPoints: 1, goalsFavor: 1, goalsOwn: 1, goalsBalance: 0, efficiency: '33.33' }])
  })
  it('should return just away games leaderboard in "/leaderboard/home"', async function () {
    const builtTeam = SequelizeMatch.build({ id: 1, homeTeamGoals: 1, awayTeamGoals: 1,
       homeTeamId: 1, awayTeamId: 2, inProgress: false });
    sinon.stub(SequelizeMatch, 'findAll').resolves([builtTeam]);
    const res = await chai.request(app).get('/leaderboard/away')
    expect(res).to.have.status(200)
    expect(res.body).to.be.deep.eq([{ totalGames: 1, totalVictories: 0, totalDraws: 1, totalLosses: 0, totalPoints: 1, goalsFavor: 1, goalsOwn: 1, goalsBalance: 0, efficiency: '33.33' }])
  })
})
