import { GraphQLError } from 'graphql';

export class GraphQLRequestError extends Error {
  constructor(public errors: GraphQLError[]) {
    super(errors[0].message);
  }
}
