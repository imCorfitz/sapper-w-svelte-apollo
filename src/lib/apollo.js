import fetch from 'node-fetch';
import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri: 'https://graphqlzero.almansi.me/api',
  fetch,
});
