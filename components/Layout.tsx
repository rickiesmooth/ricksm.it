import Head from 'next/head'

export default function Layout({
  children,
  pageTitle,
  description,
  siteName = 'ricksm.it',
  twitterHandle = 'rick5m',
  previewImage = 'https://ricksm.it/uploads/clouds.jpg', // @TODO use process.env
}) {
  return (
    <main className="md-container max-w-screen-md container mx-auto px-4 my-16">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="description" content={description}></meta>
        <title>{pageTitle}</title>

        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content={twitterHandle} key="twhandle" />

        {/* Open Graph */}
        <meta property="og:image" content={previewImage} key="ogimage" />
        <meta property="og:site_name" content={siteName} key="ogsitename" />
        <meta property="og:title" content={pageTitle} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
      </Head>
      {children}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
        }

        :root {
          --site-color: royalblue;
          --divider-color: rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </main>
  )
}
