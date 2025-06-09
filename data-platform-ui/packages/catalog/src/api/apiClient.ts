import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';
import { Observable } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { print } from 'graphql/language/printer';
import { map } from 'rxjs/operators';
import { GraphQLRequestError } from './errors';

export default class APIClient extends GraphQLClient {
  private readonly _graphQLEndpoint: string;
  constructor(graphQLEndpoint = '/api/catalog') {
    super(graphQLEndpoint, { credentials: 'include' });

    this._graphQLEndpoint = graphQLEndpoint;
  }

  /**
   * RXJS version of a graphQL request
   * @param {RequestDocument} document
   * @param {V} variables
   * @return {Observable<T>}
   */
  public request$<T = any, V = Variables>(document: RequestDocument, variables?: V): Observable<T> {
    /**
     * Translates graphql AST to a string
     */
    const query: string = typeof document === 'string' ? document : print(document);

    return ajax({
      url: this._graphQLEndpoint,
      withCredentials: true,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        query,
        variables: variables ?? {}
      },
      responseType: 'json'
    }).pipe(
      map(({ response }: AjaxResponse) => {
        if (!response.errors && response.data) {
          return response.data;
        }
        throw new GraphQLRequestError(response.errors);
      })
    );
  }
}
