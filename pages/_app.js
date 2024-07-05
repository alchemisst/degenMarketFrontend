import Header from "@/components/Header";
import "@/styles/globals.css";
import { ApolloClient, ApolloProvider,InMemoryCache } from "@apollo/client";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "your Uri"
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Degen Market</title>
        <meta name="description" content="Degen Market" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </>
  );
}
