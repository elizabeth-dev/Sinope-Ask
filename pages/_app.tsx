import { ApolloProvider } from '@apollo/client';
import client from '../core/graphql/client';
import '../styles.scss';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Sinope Ask</title>
			</Head>
			<ApolloProvider client={client}>
				<Component {...pageProps} />
			</ApolloProvider>
		</>
	);
}
