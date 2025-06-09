import type { DocumentNode } from 'graphql/language';
import { GraphQLClient, RequestOptions } from 'graphql-request';
import { NLSSError } from './errors';

declare interface ObjectLike<V = unknown> {
  [key: string]: V;
}

export class NLSSGQLClient {
  private _client: GraphQLClient | undefined;

  getClient(): GraphQLClient {
    if (this._client === undefined) {
      this._client = new GraphQLClient('/api/catalog', { credentials: 'include', mode: 'same-origin', fetch });
    }
    return this._client;
  }

  async request<T = ObjectLike, V extends ObjectLike<any> = ObjectLike>(
    document: string | DocumentNode,
    variables?: V,
    signal?: RequestOptions['signal']
  ): Promise<T | undefined | NLSSError> {
    let response: T | null;
    try {
      response = await this.getClient().request<T, V>({ document, variables, signal });
    } catch (cause: unknown) {
      return NLSSError.fromError(cause);
    }

    return response !== null ? response : undefined;
  }
}

const apiClient = new NLSSGQLClient();
export { apiClient };
export { gql } from 'graphql-request';
