"use client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const createApolloClient = new ApolloClient({
   link: new HttpLink({
      uri: "https://um1plolxh5.execute-api.us-east-1.amazonaws.com/graphql",
   }),
   cache: new InMemoryCache({
      addTypename: false,
   }),
});
 