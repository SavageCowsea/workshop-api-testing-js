const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

describe('Consuming HEAD Mehtods', () => {
  let oldResponse;
  describe('When checking the page with HEAD', () => {
    it('Page should redirected', async () => {
      try {
        await agent.head('https://github.com/aperdomob/redirect-test');
      } catch (response) {
        oldResponse = response;
      }

      expect(oldResponse.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(oldResponse.response.headers.location).to.equal('https://github.com/aperdomob/new-redirect-test');
    });
  });

  describe('checking the page with GET', () => {
    it('The page should redirect', async () => {
      const response = await agent.get('https://github.com/aperdomob/redirect-test');
      expect(response.status).to.equal(statusCode.OK);
    });
  });
});
