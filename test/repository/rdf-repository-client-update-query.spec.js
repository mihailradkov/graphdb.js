const HttpClient = require('http/http-client');
const RDFRepositoryClient = require('repository/rdf-repository-client');
const RepositoryClientConfig = require('repository/repository-client-config');
const UpdateQueryPayload = require('query/update-query-payload');
const QueryContentType = require('http/query-content-type');

const httpClientStub = require('../http/http-client.stub');

jest.mock('http/http-client');

describe('RDFRepositoryClient - update query', () => {
  let config;
  let repository;
  let postMock;

  beforeEach(() => {
    HttpClient.mockImplementation(() => httpClientStub());
    config = new RepositoryClientConfig(
      ['http://host/repositories/repo1'], {}, '', 1000, 1000);
    repository = new RDFRepositoryClient(config);
    postMock = repository.httpClients[0].post;
  });

  test('should make a POST request with Content-Type/sparql-update header and unencoded sparql query as body', () => {
    const payload = new UpdateQueryPayload()
      .setQuery('INSERT {?s ?p ?o} WHERE {?s ?p ?o}');

    return repository.update(payload).then(() => {
      expect(postMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledWith('/statements',
        'INSERT {?s ?p ?o} WHERE {?s ?p ?o}', {
          headers: {
            'Content-Type': 'application/sparql-update'
          }
        });
    });
  });

  test('should make a POST request with Content-Type/x-www-form-urlencoded header and encoded query plus parameters as body', () => {
    const payload = new UpdateQueryPayload()
      .setQuery('INSERT {?s ?p ?o} WHERE {?s ?p ?o}')
      .setContentType(QueryContentType.X_WWW_FORM_URLENCODED)
      .setInference(true)
      .setTimeout(5);

    return repository.update(payload).then(() => {
      expect(postMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledWith('/statements',
        'update=INSERT%20%7B%3Fs%20%3Fp%20%3Fo%7D%20WHERE%20%7B%3Fs%20%3Fp%20%3Fo%7D&infer=true&timeout=5', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
    });
  });

  describe('on payload misconfiguration', () => {
    test('should throw error if the query is missing', () => {
      const payload = new UpdateQueryPayload()
        .setContentType(QueryContentType.X_WWW_FORM_URLENCODED);

      return expect(repository.update(payload)).rejects.toEqual(Error('Parameter query is mandatory!'));
    });
  });

  test('should resolve to empty response (HTTP 204)', () => {
    const payload = new UpdateQueryPayload()
      .setQuery('INSERT {?s ?p ?o} WHERE {?s ?p ?o}');
    return expect(repository.update(payload)).resolves.toEqual();
  });
});
