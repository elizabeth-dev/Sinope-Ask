import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<title>Sinope Ask</title>
					<link href="https://fonts.googleapis.com/css2?family=Roboto&display=optional" rel="stylesheet" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
