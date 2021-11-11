const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

describe('Consuming PUT Methods', () => {
  describe('When following a user', () => {
    it('Then the user should be followed', async () => {
      const response = await agent.put('https://api.github.com/user/following/aperdomob')
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      expect(response.status).to.eql(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });
  });

  describe('When checking if one follows an user', () => {
    it('Then the user should be in the followed people list', async () => {
      const response = await agent.get('https://api.github.com/user/following')
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      const user = response.body.find((userv) => userv.login === 'aperdomob');
      expect(user.url).to.equal('https://api.github.com/users/aperdomob');
    });
  });

  describe('When checking the indempotence of the PUT method', () => {
    it('Then the PUT method should be indempotent', async () => {
      const response = await agent.put('https://api.github.com/user/following/aperdomob')
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      expect(response.status).to.eql(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });
  });
});
