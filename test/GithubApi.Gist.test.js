const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const jsCode = `
function wait(method, time) {
  return new Promise((resolve) => {
    setTimeout(resolve(method()), time);
  });
}
`;

describe('Consuming DELETE Method', () => {
  let gist;
  const createGist = {
    description: 'this is an example about promise',
    public: true,
    files: {
      'promise.js': {
        content: jsCode
      }
    }
  };
  describe('When creating a gist', () => {
    it('gist should be created', async () => {
      const response = await agent.post('https://api.github.com/gists')
        .send(createGist)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      gist = response.body;
      expect(gist).to.containSubset(createGist);
      expect(response.status).to.equal(statusCode.CREATED);
    });
  });

  describe('When checking the gist exists', () => {
    it('Then the gist should exist', async () => {
      const response = await agent.get(gist.url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      expect(response.status).to.equal(statusCode.OK);
    });
  });

  describe('When deleting the gist', () => {
    it('Then the gist should be deleted', async () => {
      const response = await agent.del(gist.url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      expect(response.status).to.equal(statusCode.NO_CONTENT);
    });
  });

  describe('When checking the gist exists again', () => {
    it('Then the gist should not exist anymore', async () => {
      let responseStatus;
      try {
        await agent.get(gist.url)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      } catch (response) {
        responseStatus = response.status;
      }
      expect(responseStatus).to.equal(statusCode.NOT_FOUND);
    });
  });
});
