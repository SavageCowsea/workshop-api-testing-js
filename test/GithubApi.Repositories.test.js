const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;
const md5 = require('md5');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

describe('Consuming GET Methods', () => {
  describe('When checking the user', () => {
    it('Then the user should be checked', () => agent.get('https://api.github.com/users/aperdomob')
      .set('User-Agent', 'agent').auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.have.property('name');
        expect(response.body.name).to.equal('Alejandro Perdomo');
        expect(response.body).to.have.property('company');
        expect(response.body.company).to.equal('Perficient Latam');
        expect(response.body).to.have.property('location');
        expect(response.body.location).to.equal('Colombia');
      }));
  });

  describe('When checking the repository', () => {
    it('Then the jasmine-awesome-report repository should be checked', () => agent.get('https://api.github.com/users/aperdomob/repos')
      .set('User-Agent', 'agent').auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        const repository = response.body.find((repo) => repo.name === 'jasmine-awesome-report');
        expect(repository).to.have.property('name');
        expect(repository.name).to.equal('jasmine-awesome-report');
        expect(repository).to.have.property('private');
        expect(repository.private).to.equal(false);
        expect(repository).to.have.property('description');
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      }));
  });

  describe('When downloading the repository', () => {
    const noExpectedMd5 = 'd41d8cd98f00b204e9800998ecf8427e';
    const expectedMd5 = '70856a9812a378282ef37c5bafb63779';
    let zip;

    before(async () => {
      const downloadQueryResponse = await agent.get('https://github.com/aperdomob/jasmine-awesome-report/archive/master.zip')
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .buffer(true);

      zip = downloadQueryResponse.text;
    });

    it('then the repository should be downloaded', () => {
      expect(md5(zip)).to.not.equal(noExpectedMd5);
      expect(md5(zip)).to.equal(expectedMd5);
    });
  });

  describe('When checking and dowloading the README file', () => {
    let readme;

    it(' README file should be checked', async () => {
      const response = await agent.get('https://api.github.com/repos/aperdomob/jasmine-awesome-report/contents/')
        .set('User-Agent', 'agent').auth('token', process.env.ACCESS_TOKEN);
      const readmeInfo = {
        name: 'README.md',
        path: 'README.md',
        sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
      };
      readme = response.body.find((file) => file.name === 'README.md');
      expect(readme).to.containSubset(readmeInfo);
    });

    it('Then the README file should be downloaded', async () => {
      const expectedMd5 = '97ee7616a991aa6535f24053957596b1';
      const responseDownload = await agent.get(readme.download_url).set('User-Agent', 'agent');
      const zip = responseDownload.text;
      expect(md5(zip)).to.equal(expectedMd5);
    });
  });
});
