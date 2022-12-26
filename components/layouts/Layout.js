import React from 'react';
import Header from './Header';
import Head from 'next/head';

const Layout = (props) => {
  return (
    <>
      <Header />

      <Head>
        <title>Product Hunt</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU="
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css?family=PT+Sans:400,700|Roboto+Slab:400,700&display=swap"
          rel="stylesheet"
        />
        <link href="/static/css/app.css" rel="stylesheet" />
      </Head>

      <main>{props.children}</main>
    </>
  );
};

export default Layout;
