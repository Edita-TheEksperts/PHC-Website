import { Html, Head, Main, NextScript } from 'next/document';

import Document from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="de-CH">
        <Head>
          <link
            rel="preload"
            href="/fonts/Metropolis-Regular.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
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
