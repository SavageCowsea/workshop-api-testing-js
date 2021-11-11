const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

describe('Consuming POST and PATCH Methods', () => {
  describe('When checking the user', () => {
    it('Then an user should be logged in', async () => {
      const response = await agent.get('https://api.github.com/user')
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.have.property('login');
      expect(response.body).to.have.property('id');
    });
  });

  describe('When checking if the user has at least a public repository', () => {
    it('Then the user should have a public repository', async () => {
      const response = await agent.get('https://api.github.com/user')
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      const repos = await agent.get(response.body.repos_url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      expect(repos.body).not.to.eql({});
    });
  });

  describe('When checking a user repository', () => {
    it('Then the a user repository should be checked', async () => {
      const response = await agent.get('https://api.github.com/user')
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      const repos = await agent.get(response.body.repos_url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      const repo = repos.body[0];

      expect(repo).to.not.equal(null);
      expect(repo).to.have.property('id');
      expect(repo).to.have.property('name');
    });
  });

  let issue;

  describe('When creating an issue', () => {
    it('Then the issue should be created', async () => {
      const response = await agent.post('https://api.github.com/repos/CloaizaF/CommUniversity/issues')
        .send({ title: 'This is an issue' })
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      issue = response.body;
      expect(response.status).to.equal(statusCode.CREATED);
      expect(issue.title).to.equal('This is an issue');
      expect(issue.body).to.equal(null);
    });
  });

  describe('When modifying an issue', () => {
    it('Then the issue should be modified', async () => {
      const response = await agent.patch(`https://api.github.com/repos/CloaizaF/CommUniversity/issues/${issue.number}`)
        .send({ body: 'This is the body of the issue' })
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      expect(response.body.title).to.equal(issue.title);
      expect(response.body.body).to.equal('This is the body of the issue');
    });
  });
});
