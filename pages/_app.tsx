import { ApolloProvider } from '@apollo/client';
import client from '../core/graphql/client';
import '../styles.scss';

export default function App({ Component, pageProps }) {
	return (
		<ApolloProvider client={client}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
}
