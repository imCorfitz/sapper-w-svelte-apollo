
import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';


// Instantiate required constructor fields
const cache = new InMemoryCache();
const link = createHttpLink({
  uri: 'http://localhost:4000/',
});

export default new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link: link,

  // Provide some optional constructor fields
  name: 'react-web-client',
  version: '1.3',
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});