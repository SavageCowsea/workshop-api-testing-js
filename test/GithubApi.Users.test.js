const agent = require('superagent');
const { expect } = require('chai');

describe('Query parameters test', () => {
  describe('checking the default users', () => {
    it('should be a default users number', async () => {
      const response = await agent.get('https://api.github.com/users')
        .set('User-Agent', 'agent').auth('token', process.env.ACCESS_TOKEN);
      expect(response.body.length).to.equal(30);
    });
  });

  describe('Check 10 users', () => {
    it('Should be 10 users ', async () => {
      const response = await agent.get('https://api.github.com/users')
        .set('User-Agent', 'agent').auth('token', process.env.ACCESS_TOKEN).query({ per_page: 10 });
      expect(response.body.length).to.equal(10);
    });
  });

  describe('check 50 users', () => {
    it('Should be 50 users ', async () => {
      const response = await agent.get('https://api.github.com/users')
        .set('User-Agent', 'agent').auth('token', process.env.ACCESS_TOKEN).query({ per_page: 50 });
      expect(response.body.length).to.equal(50);
    });
  });
});
