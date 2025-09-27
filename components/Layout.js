import Head from 'next/head';
export default function Layout({ children, meta = {} }) {
  const title = meta.title || 'MPG Finder';
  const description = meta.description || 'Find MPG and specs for vehicles';
  const url = meta.url || '';
  const jsonLd = meta.jsonLd || null;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {url && <meta property="og:url" content={url} />}
        <meta name="twitter:card" content="summary" />
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      </Head>
      <div className="min-h-screen bg-gray-50">
        <main>{children}</main>
      </div>
    </>
  );
}
