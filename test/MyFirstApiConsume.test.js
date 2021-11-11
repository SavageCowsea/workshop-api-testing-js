const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.get('https://httpbin.org/get').query(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume HEAD Service', async () => {
    const response = await agent.head('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.OK);
  });

  it('Consume HEAD Service with query parameters', async () => {
    const query = {
      name: 'Puke Coke',
      date: '10-02-2013',
      price: '40'
    };
    const response = await agent.head('https://httpbin.org/json').query(query);

    expect(response.status).to.equal(statusCode.OK);
  });

  it('Consume PATCH Service', async () => {
    const response = await agent.patch('https://httpbin.org/patch');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('url');
  });

  it('Consume PATCH Service with query parameters', async () => {
    const query = {
      name: 'Audi e-tron',
      color: 'Blue',
      price: '100000'
    };
    const response = await agent.patch('https://httpbin.org/patch').query(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
    expect(response.body).to.have.property('form');
  });

  it('Consume PUT Service', async () => {
    const response = await agent.put('https://httpbin.org/put');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('files');
  });

  it('Consume PUT Service with query paramters', async () => {
    const query = {
      name: 'Max steel',
      type: 'Toy',
      price: '25'
    };
    const response = await agent.put('https://httpbin.org/put').set('Content-Type', 'application/json').send(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.type).to.equal('application/json');
    expect(response.body.data).to.eql(JSON.stringify(query));
  });

  it('Consume POST Service', async () => {
    const response = await agent.post('https://httpbin.org/post');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('args');
  });

  it('Consume POST Service with query paramters', async () => {
    const query = {
      name: 'Burguer',
      type: 'Food',
      price: '9'
    };
    const response = await agent.post('https://httpbin.org/post').set('Content-Type', 'application/json').send(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.type).to.equal('application/json');
    expect(response.body).to.have.property('json');
    expect(response.body.data).to.eql(JSON.stringify(query));
  });

  it('Consume DELETE Service', async () => {
    const response = await agent.delete('https://httpbin.org/delete').set('Content-Type', 'application/json');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('url');
    expect(response.type).to.equal('application/json');
  });

  it('Consume DELETE Service with query paramters', async () => {
    const query = {
      name: 'Burguer',
      type: 'Food',
      price: '9'
    };
    const response = await agent.delete('https://httpbin.org/delete').set('Content-Type', 'application/json').query(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.type).to.equal('application/json');
    expect(response.body).to.have.property('json');
    expect(response.body.args).to.eql(query);
  });
});
